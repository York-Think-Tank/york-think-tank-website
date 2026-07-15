# york-think-tank-website

Website for the York Think Tank. Strapi for the content management system (CMS)/backend, SvelteKit for the frontend, deployed with Docker behind nginx and Cloudflare.

## Repo layout

- [frontend/](frontend/) - the SvelteKit site, see its [README](frontend/README.md)
- [content-management-system/](content-management-system/) - the Strapi app, see its [README](content-management-system/README.md)
- [docker-compose.yaml](docker-compose.yaml) - development stack (Strapi + Postgres)
- [docker-compose.prod.yaml](docker-compose.prod.yaml) and [nginx/](nginx/) - production stack
- [infrastructure.md](infrastructure.md) - how production is built, shipped and hosted

## Why Strapi

Strapi is a FOSS headless CMS that lets you define content types (like the projects, journals and forums) and instantly get a REST API. It comes with a UI at `/admin`, so non-technical committee members can log in and write, edit and publish content like a regular CMS, without us needing to build one from scratch.

## Running it locally

1. Clone the repo
2. Install Docker and Docker Compose
3. Copy `.env.example` to `.env` in the repo root and fill it in (the dev defaults are fine to start)
4. Run `docker compose up` in the root of the repo. This starts Strapi and Postgres
5. Open `http://localhost:1337/admin`, register the first admin user
6. In the admin, go to Settings > API Tokens and create a read-only token, then put it in `.env` as `STRAPI_READ_API_KEY`
7. In another terminal: `cd frontend`, `npm install`, `npm run dev`, and the site is on `http://localhost:5173`

Strapi schema changes end up in `content-management-system/src/api/`, commit those. After changing a schema also regenerate the types, see the [CMS README](content-management-system/README.md).

## Deployment

Push a version tag (`v1.2.3`) and GitHub Actions builds the production images and pushes them to GHCR. The server pulls and restarts. Full details in [infrastructure.md](infrastructure.md).

## License

This project is licensed under the MIT License, see the [LICENSE](LICENSE) file for details.
