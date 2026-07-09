import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[title][$containsi]=${encodeURIComponent(q)}` : '';
    const projects = await strapi(
        `civitas-policy-projects?populate[pdf]=true&populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc&pagination[pageSize]=100${filter}`
    );
    return { projects: projects ?? [], q, strapiUrl: STRAPI_URL };
}
