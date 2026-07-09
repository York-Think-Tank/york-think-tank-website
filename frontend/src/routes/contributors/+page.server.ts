import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[name][$containsi]=${encodeURIComponent(q)}` : '';
    const contributors = await strapi(
        `ytt-contributors?populate=photo&sort=name:asc&pagination[pageSize]=100${filter}`
    );
    return { contributors: contributors ?? [], q, strapiUrl: STRAPI_URL };
}
