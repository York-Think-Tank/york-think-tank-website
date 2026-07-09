import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ url }) {
    const q = url.searchParams.get('q')?.trim() ?? '';
    const filter = q ? `&filters[title][$containsi]=${encodeURIComponent(q)}` : '';
    const forumPosts = await strapi(
        `civitas-forum-posts?populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc&pagination[pageSize]=100${filter}`
    );
    return { forumPosts: forumPosts ?? [], q, strapiUrl: STRAPI_URL };
}
