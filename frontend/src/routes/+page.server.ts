import { STRAPI_URL, strapi } from '$lib/server/strapi';

export async function load() {
    const [aboutPage, committeeMembers, projects, journals, forumPosts, events, contactSection] =
        await Promise.all([
            strapi('about-section?populate=*'),
            strapi(
                'ytt-contributors?filters[current_or_past_committee][$eq]=Current&populate=photo&sort=createdAt:asc'
            ),
            strapi(
                'civitas-policy-projects?populate[pdf]=true&populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc'
            ),
            strapi(
                'civitas-journals?populate[pdf]=true&populate[contributors]=true&sort=createdAt:desc'
            ),
            strapi(
                'civitas-forum-posts?populate[cover_image]=true&populate[contributors]=true&sort=createdAt:desc'
            ),
            strapi('ytt-events?populate[cover_image]=true&sort=event_date:desc'),
            strapi('contact-section')
        ]);
    return {
        aboutPage,
        committeeMembers: committeeMembers ?? [],
        projects: projects ?? [],
        journals: journals ?? [],
        forumPosts: forumPosts ?? [],
        events: events ?? [],
        contactSection,
        strapiUrl: STRAPI_URL
    };
}
