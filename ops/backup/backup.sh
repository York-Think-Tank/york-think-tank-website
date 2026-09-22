#!/bin/sh
# Nightly database dump, uploaded media and the server .env into the B2 restic repository.
set -eu

HEALTHCHECK_URL="${HEALTHCHECK_URL:-}"

# A schedule that stops running is otherwise invisible until a restore is needed
on_exit() {
  rc=$?
  if [ "$rc" -ne 0 ] && [ -n "$HEALTHCHECK_URL" ]; then
    curl -fsS -m 10 "$HEALTHCHECK_URL/fail" >/dev/null 2>&1 || true
  fi
}
trap on_exit EXIT

: "${RESTIC_REPOSITORY:?BACKUP_REPOSITORY is not set in .env}"

# --stdin-from-command aborts on a non-zero pg_dump, a plain pipe would store an empty dump.
# Connection details come from PGHOST, PGUSER, PGPASSWORD and PGDATABASE.
restic backup --retry-lock 30m \
  --stdin-from-command --stdin-filename strapi-db.sql --tag ytt-db \
  -- pg_dump --clean --if-exists --no-owner

rc=0
restic backup --retry-lock 30m --tag ytt-files /data/uploads /data/srv/.env || rc=$?
# Exit 3 still saves the snapshot, it only means a file went away mid-run, which
# an editor deleting media routinely causes and must not skip the retention below
case "$rc" in
  0) ;;
  3) echo "warning: some source files could not be read, snapshot saved without them" >&2 ;;
  *) exit "$rc" ;;
esac

# Grouping by tag keeps the database and file snapshot series on independent policies
restic forget --retry-lock 30m --group-by tags \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6 \
  --prune

if [ -n "$HEALTHCHECK_URL" ]; then
  curl -fsS -m 10 --retry 3 "$HEALTHCHECK_URL" >/dev/null 2>&1 || true
fi
