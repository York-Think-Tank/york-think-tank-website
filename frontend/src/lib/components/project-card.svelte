<script lang="ts">
    let {
        project,
        strapiUrl,
        bylineBack = null,
        class: className = ''
    }: {
        project: any;
        strapiUrl: string;
        // Where the profile page's back link should return to (e.g. "/#projects"
        // from the homepage section). Omit on search pages: the router already
        // knows the origin route there
        bylineBack?: string | null;
        class?: string;
    } = $props();

    const bylineQuery = $derived(bylineBack ? `?back=${encodeURIComponent(bylineBack)}` : '');
</script>

<!--Civitas Policy Project card: image + title strip link to the PDF; contributor
    names link to their profile pages (links can't nest, so they sit outside the PDF link).
    flex-col + grow chain keeps cards in a row flush when a row-mate is taller-->
<div class="flex flex-col rounded border-2 border-[#febd59] {className}">
    <a
        href="{strapiUrl}{project.pdf?.url}"
        target="_blank"
        rel="noopener"
        aria-label="Open the {project.title} PDF"
        class="group flex grow flex-col"
    >
        <div class="aspect-[3/2] rounded-t overflow-hidden bg-[#faf8f0]">
            {#if project.cover_image}
                <img
                    src="{strapiUrl}{project.cover_image.url}"
                    alt={project.cover_image.alternativeText ?? project.title}
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            {/if}
        </div>
        <div class="bg-[#febd59] rounded-b px-2 py-2 md:px-4 md:py-3 flex grow items-start justify-between gap-2 md:gap-3">
            <p class="text-xs md:text-lg font-black text-[#9a0002] leading-tight min-w-0 break-words line-clamp-2">
                {project.title}
            </p>
            <span
                class="shrink-0 text-[10px] md:text-sm font-black text-[#febd59] bg-[#9a0002] rounded px-1.5 py-0.5 md:px-2 md:py-1 group-hover:text-[#9a0002] group-hover:bg-[#faf8f0] transition"
            >
                PDF ↗
            </span>
        </div>
    </a>
    {#if project.contributors?.length}
        {@const shown = project.contributors.slice(0, 1)}
        {@const hidden = project.contributors.slice(shown.length)}
        <!--Truncated credit: first author linked, rest behind "+ N more" with a hover
            tooltip. No line-clamp here: its overflow-hidden would clip the tooltip-->
        <p class="bg-[#febd59] rounded-b px-2 pb-2 md:px-4 md:pb-3 text-xs md:text-sm text-[#9a0002] break-words">
            By
            {#each shown as contributor, i}
                <a
                    href="/contributors/{contributor.documentId}{bylineQuery}"
                    class="font-black underline decoration-[#9a0002]/40 decoration-2 underline-offset-2 hover:decoration-[#9a0002] transition"
                >{contributor.name}</a>{i < shown.length - 1 ? ', ' : ''}
            {/each}
            {#if hidden.length}
                <span
                    class="relative font-bold underline decoration-dotted decoration-[#9a0002]/40 cursor-help group/more"
                >
                    + {hidden.length} more
                    <span
                        class="hidden group-hover/more:block group-focus/more:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 w-max max-w-44 md:max-w-60 rounded bg-[#9a0002] border-2 border-[#febd59] text-[#faf8f0] text-xs px-2 py-1.5"
                    >
                        {hidden.map((c: any) => c.name).join(', ')}
                    </span>
                </span>
            {/if}
        </p>
    {/if}
</div>
