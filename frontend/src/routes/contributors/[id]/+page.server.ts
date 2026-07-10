import { error } from '@sveltejs/kit';
import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load({ params, url }) {
    // Optional ?back=/... set by homepage links to name their section of origin.
    // Only same-site paths are honoured (blocks ?back=https://evil.example redirects)
    const backParam = url.searchParams.get('back');
    const back = backParam?.startsWith('/') && !backParam.startsWith('//') ? backParam : null;
    const byContributor = `filters[contributors][documentId][$eq]=${params.id}`;
    // The contributor plus their work in each collection, for the contributions area
    const [contributor, projects, journals, forumPosts] = await Promise.all([
        strapi(`ytt-contributors/${params.id}?populate=photo`),
        strapi(
            `civitas-policy-projects?${byContributor}&populate[pdf]=true&populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc`
        ),
        strapi(
            `civitas-journals?${byContributor}&populate[pdf]=true&populate[contributors]=true&sort=createdAt:desc`
        ),
        strapi(
            `civitas-forum-posts?${byContributor}&populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc`
        )
    ]);
    if (!contributor) {
        error(404, 'Contributor not found');
    }
    return {
        contributor,
        projects: projects ?? [],
        journals: journals ?? [],
        forumPosts: forumPosts ?? [],
        back,
        strapiUrl: STRAPI_URL
    };
}
