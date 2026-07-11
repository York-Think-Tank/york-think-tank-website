<script lang="ts">
    import ContributorByline from '$lib/components/contributor-byline.svelte';
    import PublicationCard from '$lib/components/publication-card.svelte';
    import { dateStamp } from '$lib/format';

    let {
        journals = [],
        forumPosts = [],
        strapiUrl
    }: { journals: any[]; forumPosts: any[]; strapiUrl: string } = $props();
</script>

<!--Shared empty state for a column whose collection has nothing published yet-->
{#snippet emptyState(icon: string, title: string, sub: string)}
    <div class="grow flex flex-col items-center justify-center text-center py-10">
        <span aria-hidden="true" class="text-4xl md:text-5xl">{icon}</span>
        <p class="mt-3 text-base md:text-xl font-black text-[#9a0002]">{title}</p>
        <p class="mt-1 text-sm text-[#030200]/50">{sub}</p>
    </div>
{/snippet}

<!--Civitas Journals & Forum section-->
<section
    id="journals-forum"
    class="bg-[#e8eef5] px-6 py-12 md:px-8 md:py-16 min-h-[60vh] flex flex-col justify-center"
>
    <div class="w-full md:w-[85vw] mx-auto">
        <h2 class="text-3xl md:text-5xl font-black text-[#9a0002] text-center">
            CIVITAS JOURNALS & FORUM
        </h2>
        <div class="w-16 h-1 rounded bg-[#febd59] mx-auto mt-3 mb-10 md:mb-14"></div>

        <!--Journals get the narrow rail (1:2), like the mockup's sidebar. Split only at
            lg - the rail is too cramped for the date stamp + title on tablet widths, so the
            two panels stack full-width below lg-->
        <div class="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-10 lg:gap-16">
            <div
                class="flex flex-col min-w-0 bg-white rounded-lg shadow-md border-t-8 border-[#9a0002] p-6 md:p-8"
            >
                <h3 class="text-2xl md:text-4xl font-black text-[#9a0002]">
                    Civitas Journals
                </h3>
                <p class="mt-1 mb-6">
                    <a
                        href="/journals"
                        class="text-base md:text-xl font-black text-[#9a0002] underline decoration-[#9a0002] decoration-2 underline-offset-4 hover:decoration-transparent transition"
                    >
                        all volumes →
                    </a>
                </p>
                {#if journals.length}
                    <div class="border-t border-[#9a0002]">
                        {#each journals.slice(0, 6) as journal, i}
                            {@const s = dateStamp(journal.publishedAt ?? journal.createdAt)}
                            <!--Title and byline are separate links (a link can't nest in another);
                                the shared `group` drives the row's hover states-->
                            <div
                                class="group flex items-center gap-4 md:gap-5 py-4 border-b border-[#9a0002]"
                            >
                                <!--Calendar-style date stamp (visual only): month over a big day over year-->
                                {#if s}
                                    <div
                                        aria-hidden="true"
                                        class="shrink-0 w-14 md:w-16 text-center leading-none border-r-2 border-[#febd59] pr-3 md:pr-4"
                                    >
                                        <span
                                            class="block text-[10px] md:text-xs font-black uppercase tracking-wide text-[#febd59] group-hover:text-[#9a0002] transition"
                                        >
                                            {s.month}
                                        </span>
                                        <span
                                            class="block my-0.5 text-2xl md:text-3xl font-black text-[#febd59] group-hover:text-[#9a0002] transition"
                                        >
                                            {s.day}
                                        </span>
                                        <span class="block text-[10px] md:text-xs font-black text-[#9a0002]">
                                            {s.year}
                                        </span>
                                    </div>
                                {/if}
                                <div class="min-w-0 grow">
                                    <!--Latest tag sits above the title, in the solid brand gold-->
                                    {#if i === 0}
                                        <span
                                            class="inline-block mb-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#9a0002] bg-[#febd59] rounded-full px-2 py-0.5"
                                        >
                                            Latest
                                        </span>
                                    {/if}
                                    <a
                                        href="{strapiUrl}{journal.pdf?.url}"
                                        target="_blank"
                                        rel="noopener"
                                        aria-label="Open the {journal.title} PDF"
                                        class="block"
                                    >
                                        <p
                                            class="text-base md:text-2xl font-black text-[#9a0002] leading-tight underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[#9a0002] transition truncate"
                                        >
                                            {journal.title}
                                        </p>
                                    </a>
                                    <ContributorByline
                                        contributors={journal.contributors ?? []}
                                        back="/#journals-forum"
                                        class="mt-0.5 text-[#030200]/50"
                                    />
                                </div>
                                <a
                                    href="{strapiUrl}{journal.pdf?.url}"
                                    target="_blank"
                                    rel="noopener"
                                    aria-label="Open the {journal.title} PDF"
                                    class="shrink-0 text-[10px] md:text-sm font-black text-[#9a0002] border-2 border-[#febd59] rounded px-1.5 py-0.5 md:px-2 md:py-1 group-hover:bg-[#9a0002] group-hover:border-[#9a0002] group-hover:text-[#febd59] transition"
                                >
                                    PDF ↗
                                </a>
                            </div>
                        {/each}
                    </div>
                {:else}
                    {@render emptyState(
                        '📖',
                        'The first volume is on its way',
                        'Civitas journals will appear here once published.'
                    )}
                {/if}
            </div>

            <!--Forum: card grid, cover image on top with the title and byline under it-->
            <div
                class="flex flex-col min-w-0 bg-white rounded-lg shadow-md border-t-8 border-[#febd59] p-6 md:p-8"
            >
                <h3 class="text-2xl md:text-4xl font-black text-[#9a0002]">
                    Civitas Forum
                </h3>
                <p class="mt-1 mb-6">
                    <a
                        href="/forum"
                        class="text-base md:text-xl font-black text-[#9a0002] underline decoration-[#9a0002] decoration-2 underline-offset-4 hover:decoration-transparent transition"
                    >
                        all posts →
                    </a>
                </p>
                {#if forumPosts.length}
                    <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {#each forumPosts.slice(0, 6) as post}
                            <PublicationCard
                                publication={post}
                                href="/forum/{post.documentId}?back={encodeURIComponent(
                                    '/#journals-forum'
                                )}"
                                date={post.publishedAt ?? post.createdAt}
                                bylineBack="/#journals-forum"
                                {strapiUrl}
                            />
                        {/each}
                    </div>
                {:else}
                    {@render emptyState(
                        '💬',
                        'Forum posts are coming soon',
                        'Civitas forum articles will appear here once published.'
                    )}
                {/if}
            </div>
        </div>
    </div>
</section>
