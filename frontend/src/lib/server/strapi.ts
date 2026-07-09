import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

export { STRAPI_URL };

const headers = {
    Authorization: `Bearer ${STRAPI_READ_API_KEY}`
};

// Fetch a Strapi endpoint (everything after /api/) with the read token and hand back
// its data. Comes back null when the entry isn't there, so list callers add ?? []
export async function strapi(path: string) {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, { headers });
    return (await res.json()).data ?? null;
}
