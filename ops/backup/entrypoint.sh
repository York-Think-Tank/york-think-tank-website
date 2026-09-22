#!/bin/sh
# Runs a given command as-is, otherwise makes sure the repository exists and starts the schedule.
set -eu

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

if [ -z "${RESTIC_REPOSITORY:-}" ]; then
  echo "backup: BACKUP_REPOSITORY is not set in .env, scheduled runs will fail until it is" >&2
else
  # Exit 10 means nothing exists at that address yet, any other failure is left for the runs to report
  rc=0
  restic cat config >/dev/null 2>&1 || rc=$?
  if [ "$rc" -eq 10 ]; then
    restic init
  fi
fi

exec supercronic /etc/ytt-backup/crontab
