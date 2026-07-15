# Content management system

Strapi 5 app that backs the site. Editors log in at `/admin` to write and publish content, the frontend reads it over the REST API with a read-only token.

## Content types

- `ytt-contributor` - committee members and other contributors, one flat type
- `ytt-event` - events
- `civitas-journal`, `civitas-forum-post`, `civitas-policy-project` - the publications
- `about-section`, `contact-section` - single types for the homepage sections

## Development

Run `docker compose up` from the repo root, not from this folder. That starts Strapi in develop mode with this folder's `config/` and `src/` bind mounted, plus a Postgres container. The admin is at `http://localhost:1337/admin`.

Schema edits made through the admin's content-type builder land in `src/api/`, commit them. Two gotchas:

- Adding a whole new api folder sometimes needs a `docker restart strapi` before Strapi picks it up.
- After any schema change, regenerate the TypeScript types and commit them, because the production image build type checks against `types/generated/` and fails if they're stale:

```bash
docker exec strapi sh -c "cd /opt/app && npm run strapi ts:generate-types"
docker cp strapi:/opt/app/types/generated/. content-management-system/types/generated/
```

## Production

The production image is built from [Dockerfile.prod](Dockerfile.prod) by GitHub Actions, not the dev [Dockerfile](Dockerfile). It compiles the admin panel, prunes dev dependencies and runs `strapi start`. Uploaded media lives in a Docker volume mounted at `public/uploads`. See [infrastructure.md](../infrastructure.md) in the repo root for the whole picture.

## Useful Strapi docs

- [CLI reference](https://docs.strapi.io/dev-docs/cli)
- [Official documentation](https://docs.strapi.io)
