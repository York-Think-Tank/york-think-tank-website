import { env } from '$env/dynamic/private';

// Read at runtime (not inlined at build) so one Docker image works everywhere;
// values come from the container environment / root .env
export const STRAPI_URL = env.STRAPI_URL;

const headers = {
    Authorization: `Bearer ${env.STRAPI_READ_API_KEY}`
};

// Fetch a Strapi endpoint (everything after /api/) with the read token and hand back
// its data. Comes back null when the entry isn't there, so list callers add ?? []
export async function strapi(path: string) {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, { headers });
    return (await res.json()).data ?? null;
}
