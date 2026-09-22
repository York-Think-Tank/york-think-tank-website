# Backup sidecar for the production stack. Plain Alpine rather than the postgres
# image, which declares a VOLUME that would orphan a volume on every recreate.
FROM alpine:3.23

# pg_dump must share the server's major version, currently 18
RUN apk add --no-cache postgresql18-client restic supercronic curl

COPY crontab /etc/ytt-backup/crontab
COPY entrypoint.sh backup.sh check.sh /usr/local/bin/

ENTRYPOINT ["entrypoint.sh"]
