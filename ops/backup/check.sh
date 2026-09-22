#!/bin/sh
# Weekly repository integrity check.
set -eu

CHECK_HEALTHCHECK_URL="${CHECK_HEALTHCHECK_URL:-}"

# Silent corruption is the failure this exists to catch, so it has to be loud
on_exit() {
  rc=$?
  if [ "$rc" -ne 0 ] && [ -n "$CHECK_HEALTHCHECK_URL" ]; then
    curl -fsS -m 10 "$CHECK_HEALTHCHECK_URL/fail" >/dev/null 2>&1 || true
  fi
}
trap on_exit EXIT

: "${RESTIC_REPOSITORY:?BACKUP_REPOSITORY is not set in .env}"

# An eighth of the pack data per week, so every byte is re-verified over 8 weeks.
# Leading zero stripped so weeks 08 and 09 are not read as octal.
week=$(date +%V)
restic check --retry-lock 30m --read-data-subset="$(( (${week#0} % 8) + 1 ))/8"

if [ -n "$CHECK_HEALTHCHECK_URL" ]; then
  curl -fsS -m 10 --retry 3 "$CHECK_HEALTHCHECK_URL" >/dev/null 2>&1 || true
fi
