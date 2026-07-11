<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import PublicationCard from '$lib/components/publication-card.svelte';
    import JournalCover from '$lib/components/journal-cover.svelte';

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

    // All three collections are equal citizens of one feed, newest first. Projects and
    // journals open their PDF; forum posts open their reading page. Journals have no
    // cover_image field, so their cards render the typographic journalCover snippet
    type Kind = 'Policy Project' | 'Forum' | 'Journal';
    const when = (item: any) => +new Date(item.publishedAt ?? item.createdAt);
    const feed = $derived(
        [
            ...data.projects.map((item: any) => ({
                kind: 'Policy Project' as Kind,
                item,
                href: `${strapiUrl}${item.pdf?.url}`,
                external: true
            })),
            ...data.forumPosts.map((item: any) => ({
                kind: 'Forum' as Kind,
                item,
                href: `/forum/${item.documentId}`,
                external: false
            })),
            ...data.journals.map((item: any) => ({
                kind: 'Journal' as Kind,
                item,
                href: `${strapiUrl}${item.pdf?.url}`,
                external: true
            }))
        ].sort((a, b) => when(b.item) - when(a.item))
    );

    const kindCounts = $derived([
        {
            id: 'Policy Project' as Kind,
            pill: 'Policy Projects',
            stat: data.projects.length === 1 ? 'Policy Project' : 'Policy Projects',
            count: data.projects.length
        },
        {
            id: 'Forum' as Kind,
            pill: 'Forum',
            stat: data.forumPosts.length === 1 ? 'Forum Post' : 'Forum Posts',
            count: data.forumPosts.length
        },
        {
            id: 'Journal' as Kind,
            pill: 'Journals',
            stat: data.journals.length === 1 ? 'Journal Volume' : 'Journal Volumes',
            count: data.journals.length
        }
    ]);

    // Filter pills only appear when the feed actually mixes kinds; empty kinds get no pill
    let filter = $state<'All' | Kind>('All');
    const filters = $derived(
        kindCounts.filter((k) => k.count).length > 1
            ? [
                  { id: 'All' as const, label: `All (${feed.length})` },
                  ...kindCounts
                      .filter((k) => k.count)
                      .map((k) => ({ id: k.id, label: `${k.pill} (${k.count})` }))
              ]
            : []
    );
    const visibleFeed = $derived(
        filter === 'All' ? feed : feed.filter((entry) => entry.kind === filter)
    );

    // Hero stat tiles; clicking a live one jumps to the feed pre-filtered to its kind
    function jumpTo(kind: Kind) {
        if (filters.length) filter = kind;
        document.getElementById('contributions')?.scrollIntoView({ behavior: 'smooth' });
    }
</script>

<svelte:head>
    <title>{contributor.name} at York Think Tank</title>
</svelte:head>

{#snippet journalCover(journal: any)}
    <JournalCover {journal} />
{/snippet}

<!--min-h-dvh + burgundy on the outermost element = uniform colour, no white band-->
<div class="min-h-dvh bg-[#9a0002] flex flex-col">
    <!--Editorial masthead: cream band with oversized name typography, a giant ghost
        initial behind, and the portrait offset over a solid gold disc-->
    <header class="relative overflow-hidden bg-[#e8eef5] px-6 md:px-8 pt-6 md:pt-8 pb-10 md:pb-14">
        <div class="max-w-5xl mx-auto">
            <!--Top bar: back link + contributor search, burgundy-on-cream-->
            <div class="flex flex-wrap items-center justify-between gap-4">
                <a
                    href={backHref}
                    class="text-base md:text-lg font-black text-[#9a0002] underline decoration-[#9a0002]/40 decoration-2 underline-offset-4 hover:decoration-[#9a0002] transition"
                >
                    {backLabel}
                </a>
                <!--Small search: submits to the contributors search page (/contributors?q=...)-->
                <form action="/contributors" method="get" class="w-44 md:w-56">
                    <input
                        type="search"
                        name="q"
                        placeholder="Search contributors…"
                        class="w-full rounded bg-white text-sm text-[#030200] placeholder-[#030200]/50 px-3 py-1.5 border-2 border-[#9a0002] focus:outline-none focus:border-[#febd59]"
                    />
                </form>
            </div>

            <div
                class="relative mt-10 md:mt-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
            >
                <!--Ghost initial watermark: anchored to the hero row (below the top bar,
                    so it can't collide with the search field). On mobile it sits in the
                    gap left of the centered portrait: sized in vw so it never reaches
                    the portrait on any phone width, and top-20 centers it on the w-40
                    portrait's vertical middle. From md the row is left-aligned and the
                    letter moves to the empty right side, vertically centered on the row.
                    First child, so the portrait and text paint over it-->
                <span
                    aria-hidden="true"
                    class="absolute left-0 top-20 -translate-y-1/2 md:left-auto md:right-0 md:top-1/2 text-[18vw] md:text-[18rem] font-black leading-none text-[#9a0002]/[0.08] select-none pointer-events-none"
                >
                    {contributor.name?.trim()?.[0] ?? 'Y'}
                </span>

                <!--Portrait over an offset gold disc, like a pull-out plate in a magazine-->
                <div class="relative shrink-0">
                    <div
                        aria-hidden="true"
                        class="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-full bg-[#febd59]"
                    ></div>
                    <div
                        class="relative w-40 md:w-52 aspect-square rounded-full overflow-hidden border-4 border-[#9a0002] bg-[#febd59]"
                    >
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
                                class="w-full h-full object-contain p-6"
                            />
                        {/if}
                    </div>
                </div>

                <div class="min-w-0 text-center md:text-left">
                    <p
                        class="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-[#9a0002]/60"
                    >
                        York Think Tank · Contributor
                    </p>
                    <h1
                        class="mt-2 text-4xl md:text-6xl font-black text-[#9a0002] leading-[0.95] break-words"
                    >
                        {contributor.name}
                    </h1>
                    {#if position}
                        <p
                            class="inline-block mt-3 text-sm md:text-base font-black text-[#9a0002] bg-[#febd59] rounded-full px-3 py-1"
                        >
                            {position}
                        </p>
                    {/if}
                    {#if contributor.bio?.length}
                        <!--Bio reads as a pull quote: a gold rule down the side. text-left
                            even inside the mobile-centered column, so multi-paragraph bios
                            keep a steady left edge-->
                        <div
                            class="mt-5 max-w-2xl text-left text-base md:text-lg text-[#030200]/80 border-l-4 border-[#febd59] pl-4 md:pl-5"
                        >
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
            </div>

            <!--Stat strip: one tile per collection; live tiles jump to the contributions
                feed pre-filtered to their kind, empty ones sit dimmed-->
            <div
                class="mt-10 md:mt-12 border-t-2 border-[#9a0002]/10 pt-5 flex justify-center md:justify-start divide-x-2 divide-[#9a0002]/10"
            >
                {#each kindCounts as kind}
                    <button
                        type="button"
                        onclick={() => jumpTo(kind.id)}
                        disabled={!kind.count}
                        class="px-5 md:px-8 md:first:pl-0 text-center md:text-left {kind.count
                            ? 'cursor-pointer group'
                            : 'opacity-40 cursor-default'}"
                    >
                        <span class="block text-3xl md:text-4xl font-black text-[#9a0002]">
                            {kind.count}
                        </span>
                        <span
                            class="block mt-1 text-[10px] md:text-xs font-black uppercase tracking-widest text-[#9a0002]/60 underline decoration-transparent decoration-2 underline-offset-4 group-hover:decoration-[#febd59] transition"
                        >
                            {kind.stat}
                        </span>
                    </button>
                {/each}
            </div>
        </div>
    </header>

    <!--Brand-gold seam between the cream masthead and the burgundy body-->
    <div aria-hidden="true" class="h-2 shrink-0 bg-[#febd59]"></div>

    <section id="contributions" class="grow px-6 md:px-8 py-12 md:py-16">
        <div class="max-w-5xl mx-auto">
            <h2 class="text-2xl md:text-3xl font-black text-[#febd59] text-center">
                CONTRIBUTIONS
            </h2>
            <div class="w-16 h-1 rounded bg-[#febd59] mx-auto mt-3 mb-8 md:mb-10"></div>

            {#if feed.length}
                {#if filters.length}
                    <div
                        class="flex flex-wrap justify-center gap-2 mb-10"
                        role="group"
                        aria-label="Filter contributions"
                    >
                        {#each filters as f}
                            <button
                                type="button"
                                aria-pressed={filter === f.id}
                                onclick={() => (filter = f.id)}
                                class="text-xs md:text-sm font-black uppercase tracking-widest rounded-full px-3 py-1.5 border-2 transition cursor-pointer {filter ===
                                f.id
                                    ? 'bg-[#febd59] border-[#febd59] text-[#9a0002]'
                                    : 'border-[#febd59]/40 text-[#faf8f0] hover:border-[#febd59]'}"
                            >
                                {f.label}
                            </button>
                        {/each}
                    </div>
                {/if}
                <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-8">
                    {#each visibleFeed as entry (entry.kind + entry.item.documentId)}
                        <!--relative wrapper so the kind tag can sit astride the card's
                            top border, cut-out-label style-->
                        <div class="relative">
                            <PublicationCard
                                publication={entry.item}
                                href={entry.href}
                                external={entry.external}
                                date={entry.item.publishedAt ?? entry.item.createdAt}
                                borderColor="#febd59"
                                coverFallback={entry.kind === 'Journal' ? journalCover : undefined}
                                {strapiUrl}
                                class="h-full"
                            />
                            <!--Decorative label, not a control: pointer-events-none lets
                                clicks fall through to the card link beneath, and the squarer
                                corners stop it looking like the round filter buttons-->
                            <span
                                class="absolute -top-3 left-3 z-10 pointer-events-none text-[10px] md:text-xs font-black uppercase tracking-widest text-[#febd59] bg-[#9a0002] border-2 border-[#febd59] rounded px-2.5 py-0.5"
                            >
                                {entry.kind}
                            </span>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="text-center py-14">
                    <span aria-hidden="true" class="text-4xl md:text-5xl">🖋️</span>
                    <p class="mt-3 text-lg md:text-xl font-black text-[#faf8f0]">
                        No contributions yet
                    </p>
                    <p class="mt-1 text-sm md:text-base text-[#faf8f0]/60">
                        Work by {contributor.name} will appear here once published.
                    </p>
                </div>
            {/if}
        </div>
    </section>
</div>
