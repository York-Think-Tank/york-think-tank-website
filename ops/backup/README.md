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
docker compose -f docker-compose.prod.yaml pull
docker compose -f docker-compose.prod.yaml up -d
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
docker compose -f docker-compose.prod.yaml run --rm --no-deps --volume ytt_strapi-uploads:/restore \
  backup restic restore --tag ytt-files latest:/data/uploads --target /restore
```

`.env`, written to a separate file so you can compare first:

```bash
docker compose -f docker-compose.prod.yaml run --rm --no-deps -T \
  backup restic dump --tag ytt-files latest /data/srv/.env > .env.restored
```

## Moving to a new server or domain

1. Stop backups on the old server so two servers don't write to the same repo: `docker stop backup`
2. On the new server, install Docker and copy `docker-compose.prod.yaml` and `nginx/` to `/srv/ytt`.
3. Make a `.env` with just the four `BACKUP_*` lines, then pull the real one out of the backup:

   ```bash
   cd /srv/ytt
   docker compose -f docker-compose.prod.yaml pull
   docker compose -f docker-compose.prod.yaml run --rm --no-deps -T \
     backup restic dump --tag ytt-files latest /data/srv/.env > .env.restored
   mv .env.restored .env && chmod 600 .env
   ```

4. New domain? Change `SITE_DOMAIN`, `CMS_DOMAIN` and `STRAPI_URL` in `.env`. Nothing in the database needs touching. If you forget `STRAPI_URL`, images will still point at the old domain.
5. `docker compose -f docker-compose.prod.yaml up -d`, wait for `strapiDB` to be healthy, then restore the database and uploads as above.
6. Point the Cloudflare DNS records at the new IP. Keep the old server around until the new one is working.

## Notes

- `docker logs backup` shows every run.
- For alerts when a backup fails, make two free checks on [healthchecks.io](https://healthchecks.io) (daily and weekly) and add them to `.env` as `BACKUP_HEALTHCHECK_URL` and `BACKUP_CHECK_HEALTHCHECK_URL`.
- "Some source files could not be read" is fine. It means someone deleted a file while the backup was running, and the backup still saved.
- "Repository is already locked" after a crash: `docker exec backup restic unlock`.
- If the database moves off Postgres 18, change `postgresql18-client` in the `Dockerfile` to match.
