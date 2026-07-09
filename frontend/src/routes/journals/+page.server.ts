import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[title][$containsi]=${encodeURIComponent(q)}` : '';
    const journals = await strapi(
        `civitas-journals?populate[pdf]=true&populate[contributors]=true&sort=createdAt:desc&pagination[pageSize]=100${filter}`
    );
    return { journals: journals ?? [], q, strapiUrl: STRAPI_URL };
}
