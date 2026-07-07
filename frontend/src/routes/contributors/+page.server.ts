import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

const headers = {
    Authorization: `Bearer ${STRAPI_READ_API_KEY}`
};

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[name][$containsi]=${encodeURIComponent(q)}` : '';
    const res = await fetch(
        `${STRAPI_URL}/api/ytt-contributors?populate=photo&sort=name:asc&pagination[pageSize]=100${filter}`,
        { headers }
    );
    const { data: contributors } = await res.json();
    return {
        contributors: contributors ?? [],
        q,
        strapiUrl: STRAPI_URL
    };
}
