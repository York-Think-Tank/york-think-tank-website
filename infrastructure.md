# Infrastructure

How the site is built, shipped and hosted. The root README covers local development, this file is about production.

## The short version

Everything runs on one small VPS with Docker Compose: six containers (a Cloudflare Tunnel, nginx, the SvelteKit frontend, Strapi, Postgres and a nightly backup job). Cloudflare sits in front and handles TLS and DNS, and reaches the server through the tunnel. Images are built by GitHub Actions when we push a version tag, and the server just pulls them from GHCR.

```
internet
   |
Cloudflare (TLS, proxied DNS)
   |
cloudflared                (outbound tunnel, no open ports)
   |
 nginx :80 ── yorkthinktank.co.uk ──────> frontend :3000   (SvelteKit, adapter-node)
   |
   └──────── cms.yorkthinktank.co.uk ──> strapi :1337      (admin, REST API, /uploads)
                                             |
                                         strapiDB :5432    (Postgres, internal only)
```

Nothing has a published port. `cloudflared` connects out to Cloudflare and hands requests to nginx over the Docker network, so hitting the server's IP gets you nothing. nginx routes purely on the Host header, which the tunnel passes through untouched. The DB is only reachable by Strapi and the backup job over the internal Docker network.

## The containers

| service     | image                                   | job |
|-------------|-----------------------------------------|-----|
| cloudflared | cloudflare/cloudflared (stock)          | tunnel from Cloudflare to nginx, the only way in |
| nginx       | nginx:alpine (stock)                    | reverse proxy for both hostnames |
| frontend    | ghcr.io/york-think-tank/ytt-frontend    | server side rendered SvelteKit site |
| strapi      | ghcr.io/york-think-tank/ytt-strapi      | CMS admin panel + REST API + uploaded media |
| strapiDB    | postgres:alpine (stock)                 | database for Strapi |
| backup      | ghcr.io/york-think-tank/ytt-backup      | nightly encrypted backups to Backblaze B2 |

The nginx config is a template ([nginx/templates/default.conf.template](nginx/templates/default.conf.template)). The official image runs envsubst on it at startup, so the hostnames come from the server's `.env` rather than being hardcoded. It also raises the upload limit for the CMS (journal and project PDFs) and sets long cache headers on `/uploads/`.

One detail worth knowing: the frontend does not fetch CMS data through the public URL. Server side fetches go straight to `http://strapi:1337` over the Docker network (`STRAPI_INTERNAL_URL`), which avoids a pointless round trip through Cloudflare and keeps working even if Cloudflare challenges non-browser traffic. The public `STRAPI_URL` is only used for the media and PDF links rendered into pages, since those are loaded by the visitor's browser.

## Images and CI

Pushing a tag like `v1.2.3` triggers [the workflow](.github/workflows/build-production-images.yaml). It builds the frontend, Strapi and backup images and pushes them to GHCR tagged `:latest` and `:v1.2.3`.

- The frontend image ([frontend/Dockerfile](frontend/Dockerfile)) is a two stage build. Stage one runs `npm ci` and `vite build` with adapter-node, stage two copies the self contained `build/` output onto a bare node:alpine. Around 230 MB, runs as the node user.
- The Strapi image ([content-management-system/Dockerfile.prod](content-management-system/Dockerfile.prod)) needs the C toolchain in the build stage for sharp, plus dev dependencies for the TypeScript admin build. It prunes dev deps after building so the runtime stage only needs vips.

No secrets, tokens or URLs are baked into either image. The frontend reads its config at container start (`$env/dynamic/private`), so the same image works in any environment. That also means CI needs zero repository secrets, the built in `GITHUB_TOKEN` is enough to push to GHCR.

## Configuration

Everything configurable lives in a single `.env` in the repo clone on the server. It's never committed. The variable names (values in [.env.example](.env.example)):

- `COMPOSE_FILE=docker-compose.prod.yaml`, so plain `docker compose` runs the prod stack. Without it you get the dev one
- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_CLIENT`, `DATABASE_HOST` for Postgres
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` for Strapi, generated fresh for prod with `openssl rand -base64 32`
- `STRAPI_URL` and `STRAPI_READ_API_KEY` for the frontend. The token is a read-only API token created in the Strapi admin
- `SITE_DOMAIN` and `CMS_DOMAIN` for nginx routing
- `TUNNEL_TOKEN` for the Cloudflare Tunnel. The hostnames themselves are set in the Cloudflare dashboard under Networking → Tunnels → `ytt` → Routes, both pointing at `http://nginx:80`
- `BACKUP_REPOSITORY`, `BACKUP_PASSWORD`, `BACKUP_B2_KEY_ID` and `BACKUP_B2_APPLICATION_KEY` for backups. If they're empty the site still runs, it just doesn't back up

`ENCRYPTION_KEY` is easy to miss. Strapi uses it to encrypt stored API tokens and does not complain loudly when it's absent.

## State and backups

Only three things on the server can't be rebuilt from the repo and GHCR:

- the `strapi-data` volume, the database
- the `strapi-uploads` volume, every uploaded image and PDF
- `/srv/ytt/.env`, the secrets. Lose `ENCRYPTION_KEY` and every stored API token is gone

The `backup` container copies all three to Backblaze B2 every night at 03:00 UTC using [restic](https://restic.net). It's encrypted before it leaves the server and only uploads what changed. We keep 7 daily, 4 weekly and 6 monthly backups, and a check on Sundays makes sure they aren't corrupted.

It ships like everything else (tag, pull, `up -d`). The only setup is the `BACKUP_*` lines in `.env`. The database is backed up with `pg_dump` instead of copying the volume, since copying a running database gives you a broken copy.

Keep the backup password and B2 key in a password manager as well as on the server. Without the password nobody can open the backups, including Backblaze.

Setup, restoring and moving servers are in [ops/backup/README.md](ops/backup/README.md).

## Deploying

The server runs everything as a `deploy` user with [rootless Docker](https://docs.docker.com/engine/security/rootless/) and no sudo. To set up a new one (Debian 13):

**1. As root, once:**

```bash
apt-get update
apt-get install -y ca-certificates curl git uidmap dbus-user-session
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release; echo $VERSION_CODENAME) stable" > /etc/apt/sources.list.d/docker.list
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras

systemctl disable --now docker.service docker.socket
grep deploy /etc/subuid /etc/subgid      # if empty: usermod --add-subuids 100000-165535 --add-subgids 100000-165535 deploy
loginctl enable-linger deploy
install -d -o deploy -g deploy /srv/ytt
```

**2. As `deploy`**, logged in over SSH (not `su`):

```bash
dockerd-rootless-setuptool.sh install
echo 'export DOCKER_HOST=unix:///run/user/$(id -u)/docker.sock' >> ~/.bashrc
source ~/.bashrc
systemctl --user enable docker
docker info | grep -i rootless            # should print "rootless"
```

**3. As `deploy`, start the site:**

```bash
git clone https://github.com/York-Think-Tank/york-think-tank-website.git /srv/ytt
cd /srv/ytt
cp .env.example .env && chmod 600 .env    # fill in the Production section
docker compose up -d
```

Moving an existing site onto a new server is in [ops/backup/README.md](ops/backup/README.md).

The compose file pins the project name to `ytt`, so the volumes are always `ytt_strapi-data` and `ytt_strapi-uploads` whatever the folder is called.

## Releasing

```bash
# locally
git tag v1.2.3
git push origin v1.2.3        # GitHub Actions builds and pushes the images

# on the server, once the build is green
cd /srv/ytt
git pull
docker compose pull
docker compose up -d
```

`up -d` only recreates containers whose image or config changed, the database keeps running and volumes are untouched. To roll back, change the image tags in the compose file to the previous version and `up -d`, the old tags stay on GHCR. Run `git checkout docker-compose.prod.yaml` before the next `git pull`, or the pull will refuse.

Content changes don't need a release at all. Pages are rendered per request, so anything published in the admin shows up on the next page load.

## Notes

- **Commit the generated types after a schema change.** The dev container doesn't write `types/generated/` back to the repo, and the prod build fails on stale ones. Run `npm run strapi ts:generate-types` in the dev container and copy them out.
- **Use `$env/dynamic/private`, not `static`.** Static bakes secrets into the public image.
- **Sections have to render with no CMS data.** A fresh deploy has an empty database and no read token, so everything needs fallbacks.
- **The frontend talks to the CMS over the Docker network, not the public URL.** Cloudflare sometimes answers server traffic with a challenge page, which breaks every page load.
- **Only use the "Keep only the last version of the file" lifecycle rule on the backup bucket.** A custom rule that hides files after N days will hide the live backup data too and wreck the repo.
- **The DNS records are CNAMEs to the tunnel, not A records to an IP.** Moving servers doesn't touch DNS.
- **Two servers running the same tunnel token both get traffic.** When moving, shut the old one down once the new one works.
