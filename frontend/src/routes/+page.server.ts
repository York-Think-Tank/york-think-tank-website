import { STRAPI_READ_API_KEY, STRAPI_URL } from '$env/static/private';

export async function load() {
    const res = await fetch(`${STRAPI_URL}/api/about-page?populate=*`, {
        headers: {
            Authorization: `Bearer ${STRAPI_READ_API_KEY}`
        }
    });
    const { data } = await res.json();
    return {
        aboutPage: data,
        strapiUrl: STRAPI_URL
    };
}