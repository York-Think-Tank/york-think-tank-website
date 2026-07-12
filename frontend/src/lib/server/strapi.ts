import { env } from '$env/dynamic/private';

// Read at runtime (not inlined at build) so one Docker image works everywhere;
// values come from the container environment / root .env.
// STRAPI_URL is the browser-facing base for media/PDF links; server-side API
// fetches use STRAPI_INTERNAL_URL (e.g. http://strapi:1337 on the Docker
// network) when set, so they never round-trip through Cloudflare.
export const STRAPI_URL = env.STRAPI_URL;
const fetchBase = env.STRAPI_INTERNAL_URL || env.STRAPI_URL;

const headers = {
    Authorization: `Bearer ${env.STRAPI_READ_API_KEY}`
};

// Fetch a Strapi endpoint (everything after /api/) with the read token and hand back
// its data. Comes back null when the entry isn't there, so list callers add ?? []
export async function strapi(path: string) {
    const res = await fetch(`${fetchBase}/api/${path}`, { headers });
    return (await res.json()).data ?? null;
}
