<script lang="ts">
    import type { Snippet } from 'svelte';
    import ContributorByline from '$lib/components/contributor-byline.svelte';
    import { formatDate } from '$lib/format';

    let {
        publication,
        href,
        external = false,
        date = null,
        coverAspect = 'aspect-[4/3]',
        color = '#9a0002',
        borderColor = '#9a0002',
        strapiUrl,
        bylineBack = null,
        coverFallback,
        class: className = ''
    }: {
        publication: any;
        // Link target: an external Strapi PDF url (external) or an in-app route like /forum/...
        href: string;
        // External PDF: opens in a new tab and shows a "PDF ↗" badge over the cover
        external?: boolean;
        // ISO timestamp shown under the title; null/omitted hides the date line
        date?: string | null;
        // Cover ratio as a Tailwind class (forum & projects share the 4/3 default)
        coverAspect?: string;
        // Accent colour for the title, date and byline text. A runtime value, so it rides
        // on inline styles, not a Tailwind class (those are generated ahead of time)
        color?: string;
        // Outline colour, separate from the text so a card can have e.g. a gold border
        // with burgundy text. Width is a fixed 4px (border-4) for every card, matching
        // the weight of the old gold-background frame
        borderColor?: string;
        strapiUrl: string;
        // Where a profile page's back link returns to (e.g. "/#projects")
        bylineBack?: string | null;
        // Stand-in cover for collections without a cover_image field (journals have
        // only title/pdf/contributors); receives the publication, ignored otherwise
        coverFallback?: Snippet<[any]>;
        class?: string;
    } = $props();

    const published = $derived(formatDate(date));
</script>

<!--Publication card shared by Civitas Policy Projects, Journals and Forum posts.
    Forum-style layout: cover image on top, then title, date and contributor byline.
    Image and title link to the item (an external PDF or an in-app page); external PDFs
    get a "PDF ↗" badge. Contributor names link to their own profiles, so they sit outside
    the main link (links can't nest). flex-col + grow keeps cards in a row the same height.-->
<div
    class="group flex flex-col rounded-lg border-4 bg-white shadow-sm hover:shadow-md transition {className}"
    style="border-color: {borderColor}"
>
    <a
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener' : undefined}
        aria-label={external ? `Open the ${publication.title} PDF` : `Read ${publication.title}`}
        class="relative block {coverAspect} overflow-hidden rounded-t-[4px] bg-[#faf8f0]"
    >
        {#if publication.cover_image}
            <img
                src="{strapiUrl}{publication.cover_image.url}"
                alt={publication.cover_image.alternativeText ?? publication.title}
                class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
        {:else if coverFallback}
            {@render coverFallback(publication)}
        {/if}
        <!--Only external (PDF) links get the badge; in-app cards are read on the site-->
        {#if external}
            <span
                class="absolute top-2 right-2 text-[10px] md:text-sm font-black text-[#9a0002] bg-[#febd59] rounded px-1.5 py-0.5 md:px-2 md:py-1 shadow"
            >
                PDF ↗
            </span>
        {/if}
    </a>
    <div class="grow p-3">
        <!--Title links to the same target as the image; the underline fades in gold on
            hover, matching the site's gold link-hover accent-->
        <a
            {href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener' : undefined}
            class="block"
        >
            <!--line-clamp quirks: the underline lives on an inner <span> (Chrome only
                underlines a -webkit-box's first line), and at offset-2 rather than the
                usual offset-4 (the clamp's overflow:hidden clips right under the last
                line's text, so a deeper offset pushes that line's underline out of view)-->
            <p
                class="min-h-[2lh] text-sm md:text-base font-black leading-tight line-clamp-2"
                style="color: {color}"
            >
                <span
                    class="underline decoration-transparent decoration-2 underline-offset-2 group-hover:decoration-[#febd59] transition"
                    >{publication.title}</span
                >
            </p>
        </a>
        {#if published}
            <p class="mt-1 text-xs md:text-sm" style="color: {color}">{published}</p>
        {/if}
        <ContributorByline
            contributors={publication.contributors ?? []}
            back={bylineBack}
            {color}
            class="mt-0.5"
        />
    </div>
</div>
