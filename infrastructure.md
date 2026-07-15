# Infrastructure

How the site is built, shipped and hosted. The root README covers local development, this file is about production.

## The short version

Everything runs on one small VPS with Docker Compose: four containers (nginx, the SvelteKit frontend, Strapi and Postgres). Cloudflare sits in front of the box and handles TLS and DNS. Images are built by GitHub Actions when we push a version tag, and the server just pulls them from GHCR.

```
internet
   |
Cloudflare (TLS, proxied DNS)
   |
 nginx :80 ── ytt-dev.bensonc.how ──────> frontend :3000   (SvelteKit, adapter-node)
   |
   └──────── cms-ytt-dev.bensonc.how ──> strapi :1337      (admin, REST API, /uploads)
                                             |
                                         strapiDB :5432    (Postgres, internal only)
```

nginx is the only container with a published port. It routes purely on the Host header, so both hostnames point at the same machine. The DB is never reachable from outside, only Strapi can talk to it over the internal Docker network.

## The containers

| service  | image                                   | job |
|----------|-----------------------------------------|-----|
| nginx    | nginx:alpine (stock)                    | reverse proxy for both hostnames |
| frontend | ghcr.io/york-think-tank/ytt-frontend    | server side rendered SvelteKit site |
| strapi   | ghcr.io/york-think-tank/ytt-strapi      | CMS admin panel + REST API + uploaded media |
| strapiDB | postgres:alpine (stock)                 | database for Strapi |

The nginx config is a template ([nginx/templates/default.conf.template](nginx/templates/default.conf.template)). The official image runs envsubst on it at startup, so the hostnames come from the server's `.env` rather than being hardcoded. It also raises the upload limit for the CMS (journal and project PDFs) and sets long cache headers on `/uploads/`.

One detail worth knowing: the frontend does not fetch CMS data through the public URL. Server side fetches go straight to `http://strapi:1337` over the Docker network (`STRAPI_INTERNAL_URL`), which avoids a pointless round trip through Cloudflare and keeps working even if Cloudflare challenges non-browser traffic. The public `STRAPI_URL` is only used for the media and PDF links rendered into pages, since those are loaded by the visitor's browser.

## Images and CI

Pushing a tag like `v1.2.3` triggers [the workflow](.github/workflows/build-production-images.yaml). It builds both images and pushes them to GHCR tagged `:latest` and `:v1.2.3`.

- The frontend image ([frontend/Dockerfile](frontend/Dockerfile)) is a two stage build. Stage one runs `npm ci` and `vite build` with adapter-node, stage two copies the self contained `build/` output onto a bare node:alpine. Around 230 MB, runs as the node user.
- The Strapi image ([content-management-system/Dockerfile.prod](content-management-system/Dockerfile.prod)) needs the C toolchain in the build stage for sharp, plus dev dependencies for the TypeScript admin build. It prunes dev deps after building so the runtime stage only needs vips.

No secrets, tokens or URLs are baked into either image. The frontend reads its config at container start (`$env/dynamic/private`), so the same image works in any environment. That also means CI needs zero repository secrets, the built in `GITHUB_TOKEN` is enough to push to GHCR.

## Configuration

Everything configurable lives in a single `.env` on the server, next to `docker-compose.prod.yaml`. It's never committed. The variable names (values in [.env.example](.env.example)):

- `DATABASE_NAME`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, `DATABASE_CLIENT`, `DATABASE_HOST` for Postgres
- `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` for Strapi, generated fresh for prod with `openssl rand -base64 32`
- `STRAPI_URL` and `STRAPI_READ_API_KEY` for the frontend. The token is a read-only API token created in the Strapi admin
- `SITE_DOMAIN` and `CMS_DOMAIN` for nginx routing

`ENCRYPTION_KEY` is easy to miss. Strapi uses it to encrypt stored API tokens and does not complain loudly when it's absent.

## State and backups

Exactly two things on the server hold state, both named Docker volumes:

- `strapi-data`, the Postgres data directory
- `strapi-uploads`, mounted at Strapi's `public/uploads`, all uploaded images and PDFs

Containers are disposable and get recreated on every release. The volumes are the only copies of production content, so they are what backups need to cover (a `pg_dump` cron plus an archive of the uploads volume).

## Releasing

```bash
# locally
git tag v1.2.3
git push origin v1.2.3        # GitHub Actions builds and pushes the images

# on the server
cd /srv/ytt
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d
```

`up -d` only recreates containers whose image or config changed, the database keeps running and volumes are untouched. To roll back, pin the compose file to the previous version tag and `up -d` again, the old tags stay on GHCR.

Content changes don't need a release at all. Pages are rendered per request, so anything published in the admin shows up on the next page load.

## Things that have bitten us before

- **Stale generated types break the Strapi image build.** The dev container regenerates `types/generated/` internally but doesn't write it back to the repo, so after any schema change you have to regenerate them and commit (`npm run strapi ts:generate-types` inside the dev container, then copy the files out). The production build type checks against them and fails otherwise.
- **Frontend env is runtime, keep it that way.** Importing from `$env/static/private` inlines values into the bundle at build time, which would bake secrets into a public image. Always use `$env/dynamic/private` in server code.
- **Sections must render without CMS data.** Every section component has fallbacks for missing content. A fresh deploy has an empty database and the site still has to come up. This also covers the window where the read token isn't configured yet.
- **The frontend must not call the CMS through its public URL.** Cloudflare can serve an HTML challenge page to requests coming from a datacenter IP, which the frontend can't answer, and every page load would 500 trying to parse HTML as JSON. Internal traffic stays on the Docker network.
