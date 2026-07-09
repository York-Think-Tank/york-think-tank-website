import { error } from '@sveltejs/kit';
import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ params, url }) {
    // Optional ?back=/... set by homepage links to name their section of origin.
    // Only same-site paths are honoured (blocks ?back=https://evil.example redirects)
    const backParam = url.searchParams.get('back');
    const back = backParam?.startsWith('/') && !backParam.startsWith('//') ? backParam : null;
    const post = await strapi(
        `civitas-forum-posts/${params.id}?populate[cover_image]=true&populate[contributors]=true`
    );
    if (!post) {
        error(404, 'Forum post not found');
    }
    return { post, back, strapiUrl: STRAPI_URL };
}
