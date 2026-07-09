<script lang="ts">
    import { afterNavigate } from '$app/navigation';

    let { data } = $props();

    // Back target, in priority order:
    // 1. ?back=... on our own URL - homepage links declare their section explicitly
    //    (scrolling never updates the hash, so the router can't tell #committee
    //    from #projects; only the clicked link knows where it lives)
    // 2. the in-app page we navigated from (search results keep their query)
    // 3. plain home, for direct visits and shared links
    let navigatedFrom = $state<string | null>(null);
    afterNavigate(({ from }) => {
        if (from?.url) {
            navigatedFrom = from.url.pathname + from.url.search + from.url.hash;
        }
    });
    const backHref = $derived(data.back ?? navigatedFrom ?? '/');
    const backLabel = $derived(
        backHref === '/' || backHref.startsWith('/#') ? '← Back to home' : '← Back'
    );

    const contributor = $derived(data.contributor);
    const strapiUrl = $derived(data.strapiUrl);

    // "Chief Technical Officer" for current members, "Former Treasurer" for past ones
    const position = $derived(
        contributor.current_or_past_committee === 'Current'
            ? contributor.current_committee_position
            : contributor.current_or_past_committee === 'Past'
              ? `Former ${contributor.past_comittee_position ?? 'Committee Member'}`
              : null
    );

    // Contribution columns: projects and journals open their PDF, forum posts
    // open their own reading page
    const contributionKinds = $derived([
        {
            name: 'Civitas Policy Projects',
            items: data.projects,
            href: (item: any) => `${strapiUrl}${item.pdf?.url}`,
            external: true,
            coverAspect: 'aspect-[3/2]'
        },
        {
            name: 'Civitas Forum',
            items: data.forumPosts,
            href: (item: any) => `/forum/${item.documentId}`,
            external: false,
            coverAspect: 'aspect-[3/2]'
        },
        {
            name: 'Civitas Journals',
            items: data.journals,
            href: (item: any) => `${strapiUrl}${item.pdf?.url}`,
            external: true,
            coverAspect: 'aspect-[3/4]'
        }
    ]);
</script>

<svelte:head>
    <title>{contributor.name} at York Think Tank</title>
</svelte:head>

<!--min-h-dvh + single bg on the outermost element = uniform colour, no white band-->
<div class="min-h-dvh bg-[#9a0002] p-6 md:p-8 flex flex-col">
    <div class="max-w-5xl mx-auto w-full flex flex-col grow">
        <!--Top bar: back link + contributor search-->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <a
                href={backHref}
                class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
            >
                {backLabel}
            </a>
            <!--Small search: submits to the contributors search page (/contributors?q=...)-->
            <form action="/contributors" method="get" class="w-44 md:w-56">
                <input
                    type="search"
                    name="q"
                    placeholder="Search contributors…"
                    class="w-full rounded bg-[#faf8f0] text-sm text-[#030200] placeholder-[#030200]/50 px-3 py-1.5 border-2 border-[#febd59] focus:outline-none focus:border-[#ffc9c2]"
                />
            </form>
        </div>

        <!--Contributor identity: compact (~30% of the page), bio centered-->
        <div class="flex flex-col items-center text-center gap-2 mt-6">
            <div class="w-24 md:w-32 aspect-square rounded-full overflow-hidden border-4 border-[#febd59] bg-[#febd59]">
                {#if contributor.photo}
                    <img
                        src="{strapiUrl}{contributor.photo.url}"
                        alt={contributor.photo.alternativeText ?? contributor.name}
                        class="w-full h-full object-cover"
                    />
                {:else}
                    <!--Default: YTT bulb logo on brand gold, same as the committee cards-->
                    <img
                        src="/images/bulb.avif"
                        alt="York Think Tank logo placeholder for {contributor.name}"
                        class="w-full h-full object-contain p-4"
                    />
                {/if}
            </div>
            <h1 class="text-2xl md:text-3xl font-black text-[#faf8f0]">
                {contributor.name}
            </h1>
            {#if position}
                <p class="text-base md:text-xl font-black text-[#febd59]">
                    {position}
                </p>
            {/if}
            {#if contributor.bio?.length}
                <div class="text-base md:text-lg text-[#faf8f0] max-w-2xl mt-2">
                    {#each contributor.bio as block}
                        {#if block.type === 'paragraph'}
                            <p class="mb-2">
                                {block.children.map((c: any) => c.text).join('')}
                            </p>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>

        <!--Contributions: fills the remaining ~70% of the page-->

        <div class="grow mt-10">
            <h2 class="text-xl md:text-2xl font-black text-[#febd59] text-center mb-6">
                CONTRIBUTIONS
            </h2>
            <div class="grid sm:grid-cols-3 gap-4">
                {#each contributionKinds as kind}
                    <div class="border-2 border-[#febd59]/40 rounded p-4 text-center">
                        <h3 class="text-base md:text-lg font-black text-[#febd59] mb-2">
                            {kind.name}
                        </h3>
                        {#if kind.items.length}
                            <div class="flex flex-col gap-3">
                                {#each kind.items as item}
                                    <!--Cover image card; clicking opens the PDF or post-->
                                    <a
                                        href={kind.href(item)}
                                        target={kind.external ? '_blank' : undefined}
                                        rel={kind.external ? 'noopener' : undefined}
                                        aria-label={kind.external
                                            ? `Open the ${item.title} PDF`
                                            : `Read ${item.title}`}
                                        class="group block"
                                    >
                                        {#if item.cover_image}
                                            <div class="{kind.coverAspect} overflow-hidden bg-[#faf8f0]">
                                                <img
                                                    src="{strapiUrl}{item.cover_image.url}"
                                                    alt={item.cover_image.alternativeText ?? item.title}
                                                    class="w-full h-full object-cover group-hover:scale-105 transition"
                                                />
                                            </div>
                                        {/if}
                                        <p class="mt-1 text-base text-[#faf8f0] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 group-hover:decoration-[#febd59] transition">
                                            {item.title}
                                        </p>
                                    </a>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-base text-[#faf8f0]/60">
                                Nothing here yet.
                            </p>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
