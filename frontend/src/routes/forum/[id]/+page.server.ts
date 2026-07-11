import { error } from '@sveltejs/kit';
import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ params, url }) {
    // Optional ?back=/... set by homepage links to name their section of origin.
    // Only same-site paths are honoured (blocks ?back=https://evil.example redirects)
    const backParam = url.searchParams.get('back');
    const back = backParam?.startsWith('/') && !backParam.startsWith('//') ? backParam : null;
    // Contributor photos feed the byline avatar stack and the author cards
    const post = await strapi(
        `civitas-forum-posts/${params.id}?populate[cover_image]=true&populate[contributors][populate][photo]=true`
    );
    if (!post) {
        error(404, 'Forum post not found');
    }
    // "More from the forum": the three newest other posts
    const related =
        (await strapi(
            `civitas-forum-posts?filters[documentId][$ne]=${params.id}` +
                `&sort[0]=publishedAt:desc&pagination[pageSize]=3` +
                `&populate[cover_image]=true&populate[contributors]=true`
        )) ?? [];
    return { post, related, back, strapiUrl: STRAPI_URL };
}
