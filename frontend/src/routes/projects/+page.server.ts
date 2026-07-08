import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

const headers = {
    Authorization: `Bearer ${STRAPI_READ_API_KEY}`
};

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[title][$containsi]=${encodeURIComponent(q)}` : '';
    const res = await fetch(
        `${STRAPI_URL}/api/civitas-policy-projects?populate[pdf]=true&populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc&pagination[pageSize]=100${filter}`,
        { headers }
    );
    const { data: projects } = await res.json();
    return {
        projects: projects ?? [],
        q,
        strapiUrl: STRAPI_URL
    };
}
