# Backups

The `backup` container backs up the database, uploaded files and `/srv/ytt/.env` to Backblaze B2 every night at 03:00 UTC, using [restic](https://restic.net). Backups are encrypted on the server and only upload what changed, so they barely use any of the 10 GB free tier.

We keep 7 daily, 4 weekly and 6 monthly backups. Every Sunday at 06:00 a check makes sure they aren't corrupted.

| File | What it does |
|---|---|
| `Dockerfile` | Alpine with `pg_dump`, restic and supercronic (cron for containers) |
| `crontab` | when things run, in UTC |
| `entrypoint.sh` | creates the backup repo on first start, then starts the schedule |
| `backup.sh` | the nightly backup |
| `check.sh` | the weekly check |

## Setup

**1. Backblaze**

- Create a private bucket.
- In the bucket's Lifecycle Settings pick **"Keep only the last version of the file"**. Without it old backups never actually get deleted. Don't use a custom rule, it can wipe the backups.
- Create an Application Key for that bucket with Read and Write, and tick "Allow List All Bucket Names". Copy the key straight away, it's only shown once.

**2. Add to `/srv/ytt/.env`**

```bash
BACKUP_REPOSITORY=s3:<endpoint>/<bucket>      # e.g. s3:s3.eu-central-003.backblazeb2.com/ytt-backups
BACKUP_PASSWORD=                              # openssl rand -base64 48
BACKUP_B2_KEY_ID=
BACKUP_B2_APPLICATION_KEY=
```

Save these in a password manager too. If the password is lost the backups can't be opened.

**3. Start it**

```bash
cd /srv/ytt
docker compose pull
docker compose up -d
docker exec backup backup.sh              # run one now
docker exec backup restic snapshots       # should list ytt-db and ytt-files
```

## Restoring

See what's there. Any command below can take a snapshot ID instead of `latest`.

```bash
docker exec backup restic snapshots
```

Database:

```bash
docker exec backup sh -c 'set -o pipefail
  restic dump --tag ytt-db latest /strapi-db.sql | psql -X --set ON_ERROR_STOP=on'
docker restart strapi
```

Uploads:

```bash
cd /srv/ytt
docker compose run --rm --no-deps --volume ytt_strapi-uploads:/restore \
  backup restic restore --tag ytt-files latest:/data/uploads --target /restore
```

`.env`, written to a separate file so you can compare first:

```bash
docker compose run --rm --no-deps -T \
  backup restic dump --tag ytt-files latest /data/srv/.env > .env.restored
```

## Moving to a new server or domain

1. On the old server, ask editors to stop making changes, then take a final backup and stop backups there so two servers never write to the same repo:

   ```bash
   docker exec backup backup.sh
   docker stop backup
   ```

2. Set up the new server with rootless Docker and clone the repo to `/srv/ytt`, as in Deploying in [infrastructure.md](../../infrastructure.md). Stop before the `cp .env.example` line.
3. Make a `.env` with just `COMPOSE_FILE=docker-compose.prod.yaml` and the four `BACKUP_*` lines, then pull the real one out of the backup:

   ```bash
   cd /srv/ytt
   docker compose pull
   docker compose run --rm --no-deps -T \
     backup restic dump --tag ytt-files latest /data/srv/.env > .env.restored
   mv .env.restored .env && chmod 600 .env
   ```

4. New domain? Change `SITE_DOMAIN`, `CMS_DOMAIN` and `STRAPI_URL` in `.env`. Nothing in the database needs touching. If you forget `STRAPI_URL`, images will still point at the old domain.
5. Start only the database and backup containers, so the tunnel isn't serving an empty site yet. Once `strapiDB` is healthy, restore the database and uploads as in Restoring above:

   ```bash
   docker compose up -d strapiDB backup
   docker compose ps
   ```

6. `docker compose up -d` starts everything, including the tunnel. Nothing changes in DNS, the tunnel follows the token. Then run `docker compose down` on the old server, otherwise both keep taking traffic.
7. Check the site and images load and you can log in at `/admin`. If not, `docker compose up -d` on the old server takes traffic back straight away.

## Notes

- `docker logs backup` shows every run.
- For alerts when a backup fails, make two free checks on [healthchecks.io](https://healthchecks.io) (daily and weekly) and add them to `.env` as `BACKUP_HEALTHCHECK_URL` and `BACKUP_CHECK_HEALTHCHECK_URL`.
- "Some source files could not be read" is fine. It means someone deleted a file while the backup was running, and the backup still saved.
- "Repository is already locked" after a crash: `docker exec backup restic unlock`.
- If the database moves off Postgres 18, change `postgresql18-client` in the `Dockerfile` to match.
