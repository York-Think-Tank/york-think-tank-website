<script lang="ts">
    import ContributorByline from '$lib/components/contributor-byline.svelte';

    let {
        publication,
        href,
        external = false,
        coverAspect = 'aspect-[3/2]',
        strapiUrl,
        bylineBack = null,
        class: className = ''
    }: {
        publication: any;
        // Full link target: a Strapi PDF URL (external) or an in-app route like /forum/...
        href: string;
        external?: boolean;
        // Cover ratio as a Tailwind class: 3/2 for projects and forum posts,
        // aspect-[3/4] gives journals a book-cover look
        coverAspect?: string;
        strapiUrl: string;
        // Where the profile page's back link should return to (e.g. "/#projects"
        // from the homepage section). Omit on search pages: the router already
        // knows the origin route there
        bylineBack?: string | null;
        class?: string;
    } = $props();
</script>

<!--Publication card shared by Civitas Policy Projects, Journals and Forum posts:
    image + title strip link to the PDF (external) or the post's own page; contributor
    names link to their profile pages (links can't nest, so they sit outside the main link).
    flex-col + grow chain keeps cards in a row flush when a row-mate is taller-->
<!--Gold card with p-1 so the image sits framed by gold on every side-->
<div class="flex flex-col rounded-lg border-2 border-[#febd59] bg-[#febd59] p-1 {className}">
    <a
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        aria-label={external ? `Open the ${publication.title} PDF` : `Read ${publication.title}`}
        class="group flex grow flex-col"
    >
        <div class="{coverAspect} rounded overflow-hidden bg-[#faf8f0]">
            {#if publication.cover_image}
                <img
                    src="{strapiUrl}{publication.cover_image.url}"
                    alt={publication.cover_image.alternativeText ?? publication.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            {/if}
        </div>
        <div class="bg-[#febd59] px-2 py-2 md:px-4 md:py-3 flex grow items-start justify-between gap-2 md:gap-3">
            <p class="text-xs md:text-lg font-black text-[#9a0002] leading-tight min-w-0 break-words line-clamp-2">
                {publication.title}
            </p>
            <span
                class="shrink-0 text-[10px] md:text-sm font-black text-[#febd59] bg-[#9a0002] rounded px-1.5 py-0.5 md:px-2 md:py-1 group-hover:text-[#9a0002] group-hover:bg-[#faf8f0] transition"
            >
                {external ? 'PDF ↗' : 'Read →'}
            </span>
        </div>
    </a>
    <ContributorByline
        contributors={publication.contributors ?? []}
        back={bylineBack}
        class="bg-[#febd59] rounded-b px-2 pb-2 md:px-4 md:pb-3 text-xs md:text-sm text-[#9a0002] break-words"
    />
</div>
