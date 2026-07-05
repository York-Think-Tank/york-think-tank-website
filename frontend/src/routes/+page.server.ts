import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

const headers = {
    Authorization: `Bearer ${STRAPI_READ_API_KEY}`
};

export async function load() {
    const [aboutRes, committeeRes] = await Promise.all([
        fetch(`${STRAPI_URL}/api/about-section?populate=*`, { headers }),
        fetch(
            `${STRAPI_URL}/api/ytt-contributors?filters[current_or_past_committee][$eq]=Current&populate=photo&sort=createdAt:asc`,
            { headers }
        )
    ]);
    const { data: aboutPage } = await aboutRes.json();
    const { data: committeeMembers } = await committeeRes.json();
    return {
        aboutPage,
        committeeMembers: committeeMembers ?? [],
        strapiUrl: STRAPI_URL
    };
}