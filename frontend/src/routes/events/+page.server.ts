import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[title][$containsi]=${encodeURIComponent(q)}` : '';
    const events = await strapi(
        `ytt-events?populate[cover_image]=true&sort=event_date:desc&pagination[pageSize]=100${filter}`
    );
    return { events: events ?? [], q, strapiUrl: STRAPI_URL };
}
