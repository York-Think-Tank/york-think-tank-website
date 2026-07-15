# Frontend

The public site. SvelteKit with Svelte 5 (runes), Tailwind 4, TypeScript. Pages are server side rendered and pull their content from Strapi on each request.

## Development

You need the Strapi dev stack running first (`docker compose up` in the repo root) and a filled in `.env` in the repo root. Vite is pointed at the root `.env`, this folder doesn't have its own.

```bash
npm install
npm run dev
```

Site is on `http://localhost:5173`. `npm run check` and `npm run lint` before committing.

## How data loading works

All Strapi access goes through [src/lib/server/strapi.ts](src/lib/server/strapi.ts). It reads three env vars at runtime, not build time, so the production Docker image stays generic:

- `STRAPI_URL` - public base URL, used for media and PDF links rendered into pages
- `STRAPI_INTERNAL_URL` - optional, where API fetches actually go. Set in production to `http://strapi:1337` so traffic stays on the Docker network. Falls back to `STRAPI_URL` in dev
- `STRAPI_READ_API_KEY` - read-only token from the Strapi admin

`+page.server.ts` load functions call `strapi('endpoint?...')` and hand results to section components.

## Conventions

- Section components always render, even with no CMS data. Use fallbacks (`?? []`, optional chaining) instead of gating whole sections behind `{#if data}`. A fresh deploy has an empty CMS and the site still has to look presentable.
- Layout note: the sections are `flex flex-col`, and a child with `mx-auto` inside one shrinks to fit its content instead of stretching. Content containers need `w-full max-w-6xl mx-auto`, not just the last two.

## Production build

Uses adapter-node. `npm run build` produces a standalone server in `build/`, run with `node build` on port 3000. The [Dockerfile](Dockerfile) does exactly that in two stages and is built by GitHub Actions on version tags. See [infrastructure.md](../infrastructure.md) for deployment.
