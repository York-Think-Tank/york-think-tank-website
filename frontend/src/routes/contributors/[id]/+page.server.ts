import { error } from '@sveltejs/kit';
import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

const headers = {
    Authorization: `Bearer ${STRAPI_READ_API_KEY}`
};

export async function load({ params, url }) {
    // Optional ?back=/... set by homepage links to name their section of origin.
    // Only same-site paths are honoured (blocks ?back=https://evil.example redirects)
    const backParam = url.searchParams.get('back');
    const back = backParam?.startsWith('/') && !backParam.startsWith('//') ? backParam : null;
    const [contributorRes, projectsRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/ytt-contributors/${params.id}?populate=photo`, { headers }),
        // This contributor's policy projects, for the contributions area
        fetch(
            `${STRAPI_URL}/api/civitas-policy-projects?filters[contributors][documentId][$eq]=${params.id}&populate[pdf]=true&populate[cover_image]=true&sort=createdAt:desc`,
            { headers }
        )
    ]);
    if (!contributorRes.ok) {
        error(404, 'Contributor not found');
    }
    const { data: contributor } = await contributorRes.json();
    if (!contributor) {
        error(404, 'Contributor not found');
    }
    const { data: projects } = await projectsRes.json();
    return {
        contributor,
        projects: projects ?? [],
        back,
        strapiUrl: STRAPI_URL
    };
}
