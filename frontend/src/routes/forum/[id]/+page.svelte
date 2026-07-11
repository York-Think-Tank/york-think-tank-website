<script lang="ts">
    import { afterNavigate } from '$app/navigation';
    import { page } from '$app/state';
    import PublicationCard from '$lib/components/publication-card.svelte';
    import { formatDate } from '$lib/format';

    let { data } = $props();

    // Back target, in priority order (same scheme as the contributor page):
    // explicit ?back= from homepage links, then the in-app page we came from,
    // then plain home for direct visits and shared links
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

    const post = $derived(data.post);
    const strapiUrl = $derived(data.strapiUrl);

    const published = $derived(formatDate(post.publishedAt));

    // Word count over every rich text node ("N min read" at ~220 wpm, the figure
    // Medium popularised). Lists nest items under children, so it recurses
    function words(children: any[]): number {
        return (children ?? []).reduce(
            (n: number, c: any) =>
                n +
                (typeof c.text === 'string'
                    ? c.text.split(/\s+/).filter(Boolean).length
                    : words(c.children)),
            0
        );
    }
    const readMinutes = $derived(
        Math.max(
            1,
            Math.round(
                (post.content ?? []).reduce((n: number, b: any) => n + words(b.children), 0) / 220
            )
        )
    );

    // Reading progress for the gold bar pinned to the top of the viewport
    let progress = $state(0);
    function trackProgress() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }

    // Share targets get the canonical URL (no ?back= noise) and the post title
    const shareUrl = $derived(`${page.url.origin}/forum/${post.documentId}`);
    const shareTargets = $derived([
        {
            name: 'Reddit',
            href: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`
        },
        {
            name: 'X',
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`
        },
        {
            name: 'LinkedIn',
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Facebook',
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        }
    ]);

    let copied = $state(false);
    async function copyLink() {
        await navigator.clipboard.writeText(shareUrl);
        copied = true;
        setTimeout(() => (copied = false), 2000);
    }

    // "Chief Technical Officer" / "Former Treasurer" tag for the author cards,
    // mirroring the contributor profile page
    function position(c: any) {
        return c.current_or_past_committee === 'Current'
            ? c.current_committee_position
            : c.current_or_past_committee === 'Past'
              ? `Former ${c.past_comittee_position ?? 'Committee Member'}`
              : null;
    }
</script>

<svelte:head>
    <title>{post.title} - Civitas Forum</title>
</svelte:head>

<svelte:window onscroll={trackProgress} onresize={trackProgress} />

<!--Inline children of a rich text block: plain/bold/italic/underlined text and links.
    Recursive so links can carry styled text inside them-->
{#snippet inline(children: any[])}
    {#each children as child}
        {#if child.type === 'link'}
            <a
                href={child.url}
                target="_blank"
                rel="noopener"
                class="font-black text-[#9a0002] underline decoration-[#febd59] decoration-2 underline-offset-2 hover:decoration-[#9a0002] transition"
            >{@render inline(child.children ?? [])}</a>
        {:else if child.bold}<strong>{child.text}</strong>
        {:else if child.italic}<em>{child.text}</em>
        {:else if child.underline}<span class="underline">{child.text}</span>
        {:else}{child.text}{/if}
    {/each}
{/snippet}

<!--Contributor avatar, used by the byline stack and the author cards-->
{#snippet avatar(contributor: any, classes: string)}
    {#if contributor.photo}
        <img
            src="{strapiUrl}{contributor.photo.url}"
            alt={contributor.photo.alternativeText ?? contributor.name}
            class="{classes} rounded-full object-cover border-2 border-[#9a0002] bg-[#febd59]"
        />
    {:else}
        <img
            src="/images/bulb.avif"
            alt="York Think Tank logo placeholder for {contributor.name}"
            class="{classes} rounded-full object-contain p-1.5 border-2 border-[#9a0002] bg-[#febd59]"
        />
    {/if}
{/snippet}

<!--Reading progress: a gold bar growing along the top of the viewport-->
<div
    aria-hidden="true"
    class="fixed top-0 left-0 z-50 h-1 bg-[#febd59]"
    style="width: {progress * 100}%"
></div>

<!--min-h-dvh + single bg on the outermost element = uniform colour, no white band-->
<div class="min-h-dvh bg-[#9a0002] p-6 md:p-8">
    <div class="max-w-3xl mx-auto">
        <!--Top bar: back link + small search into the shared journals & forum page-->
        <div class="flex flex-wrap items-center justify-between gap-4">
            <a
                href={backHref}
                class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
            >
                {backLabel}
            </a>
            <form action="/forum" method="get" class="w-44 md:w-56">
                <input
                    type="search"
                    name="q"
                    placeholder="Search the forum…"
                    class="w-full rounded bg-[#faf8f0] text-sm text-[#030200] placeholder-[#030200]/50 px-3 py-1.5 border-2 border-[#febd59] focus:outline-none focus:border-[#ffc9c2]"
                />
            </form>
        </div>

        <article class="mt-8">
            <!--Magazine hero: the cover with a burgundy fade carrying the kicker and
                title. The gradient guarantees contrast whatever the editors upload-->
            <header class="relative overflow-hidden rounded-lg border-2 border-[#febd59] shadow-lg">
                {#if post.cover_image}
                    <img
                        src="{strapiUrl}{post.cover_image.url}"
                        alt={post.cover_image.alternativeText ?? post.title}
                        class="w-full aspect-[4/3] md:aspect-[21/10] object-cover"
                    />
                {:else}
                    <div aria-hidden="true" class="w-full aspect-[4/3] md:aspect-[21/10]"></div>
                {/if}
                <div
                    aria-hidden="true"
                    class="absolute inset-0 bg-gradient-to-t from-[#310001]/95 via-[#310001]/35 to-transparent"
                ></div>
                <div class="absolute inset-x-0 bottom-0 p-5 md:p-8">
                    <p
                        class="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#febd59]"
                    >
                        Civitas Forum{#if published}<span class="normal-case tracking-normal">
                                · {published}</span
                            >{/if}
                    </p>
                    <h1
                        class="mt-2 text-2xl md:text-4xl font-black text-[#faf8f0] leading-tight [text-wrap:balance]"
                    >
                        {post.title}
                    </h1>
                </div>
            </header>

            <!--Byline plate overlapping the hero, like a magazine pull-out: avatar stack,
                linked names, read time and a typographic share row-->
            <div
                class="relative z-10 -mt-5 mx-4 md:mx-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-lg bg-white shadow-md border-t-4 border-[#febd59] px-4 py-3 md:px-5 md:py-4"
            >
                {#if post.contributors?.length}
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex -space-x-3 shrink-0">
                            {#each post.contributors.slice(0, 4) as contributor}
                                {@render avatar(contributor, 'w-9 h-9 md:w-10 md:h-10')}
                            {/each}
                        </div>
                        <p class="text-xs md:text-sm text-[#030200]/60 min-w-0">
                            By
                            {#each post.contributors as contributor, i}
                                <a
                                    href="/contributors/{contributor.documentId}"
                                    class="font-black text-[#9a0002] underline decoration-[#9a0002]/40 decoration-2 underline-offset-2 hover:decoration-[#9a0002] transition"
                                >{contributor.name}</a>{i < post.contributors.length - 1
                                    ? ', '
                                    : ''}
                            {/each}
                            <span class="whitespace-nowrap">· {readMinutes} min read</span>
                        </p>
                    </div>
                {:else}
                    <p class="text-xs md:text-sm text-[#030200]/60">{readMinutes} min read</p>
                {/if}
                <!--Share row: typographic pills, in keeping with the site's type-led look-->
                <div class="flex flex-wrap items-center gap-1.5">
                    <span
                        class="text-[10px] font-black uppercase tracking-widest text-[#030200]/40"
                    >
                        Share
                    </span>
                    {#each shareTargets as target}
                        <a
                            href={target.href}
                            target="_blank"
                            rel="noopener"
                            class="text-[10px] md:text-xs font-black text-[#9a0002] border-2 border-[#febd59] rounded-full px-2 py-0.5 hover:bg-[#9a0002] hover:border-[#9a0002] hover:text-[#febd59] transition"
                        >
                            {target.name}
                        </a>
                    {/each}
                    <button
                        type="button"
                        onclick={copyLink}
                        class="text-[10px] md:text-xs font-black text-[#9a0002] border-2 border-[#febd59] rounded-full px-2 py-0.5 hover:bg-[#9a0002] hover:border-[#9a0002] hover:text-[#febd59] transition cursor-pointer"
                    >
                        {copied ? 'Copied!' : 'Copy link'}
                    </button>
                </div>
            </div>

            <!--Reading surface: cream card, dark text - blog body text belongs on a light
                background, and the drop cap echoes the ghost initial on profile pages-->
            <div class="mt-6 rounded-lg bg-[#faf8f0] shadow-lg px-5 py-8 md:px-10 md:py-10">
                <div class="max-w-[70ch] mx-auto text-base md:text-lg leading-relaxed text-[#030200]/85">
                    {#each post.content ?? [] as block, i}
                        {#if block.type === 'paragraph'}
                            <!--Only the very first block earns the drop cap-->
                            <p
                                class="mb-5 {i === 0
                                    ? 'first-letter:float-left first-letter:mr-3 first-letter:text-6xl md:first-letter:text-7xl first-letter:leading-[0.8] first-letter:font-black first-letter:text-[#9a0002]'
                                    : ''}"
                            >
                                {@render inline(block.children)}
                            </p>
                        {:else if block.type === 'heading' && block.level <= 2}
                            <h2 class="mt-10 mb-4 text-2xl md:text-3xl font-black text-[#9a0002]">
                                {@render inline(block.children)}
                            </h2>
                        {:else if block.type === 'heading'}
                            <h3 class="mt-8 mb-3 text-xl md:text-2xl font-black text-[#9a0002]">
                                {@render inline(block.children)}
                            </h3>
                        {:else if block.type === 'list' && block.format === 'ordered'}
                            <ol class="list-decimal pl-6 mb-5 space-y-1.5 marker:font-black marker:text-[#9a0002]">
                                {#each block.children as item}
                                    <li>{@render inline(item.children ?? [])}</li>
                                {/each}
                            </ol>
                        {:else if block.type === 'list'}
                            <ul class="list-disc pl-6 mb-5 space-y-1.5 marker:text-[#9a0002]">
                                {#each block.children as item}
                                    <li>{@render inline(item.children ?? [])}</li>
                                {/each}
                            </ul>
                        {:else if block.type === 'quote'}
                            <!--Pull quote: gold rail + tinted panel, bold burgundy voice-->
                            <blockquote
                                class="my-8 border-l-4 border-[#febd59] bg-[#febd59]/15 rounded-r-lg px-5 py-4 text-lg md:text-xl font-bold italic text-[#9a0002]"
                            >
                                {@render inline(block.children)}
                            </blockquote>
                        {:else if block.type === 'image' && block.image}
                            <img
                                src={block.image.url.startsWith('/')
                                    ? `${strapiUrl}${block.image.url}`
                                    : block.image.url}
                                alt={block.image.alternativeText ?? ''}
                                class="rounded-lg shadow my-8 max-w-full mx-auto"
                            />
                        {/if}
                    {/each}
                </div>

                <!--Author cards: who wrote it, with the profile link and committee tag-->
                {#if post.contributors?.length}
                    <div class="max-w-[70ch] mx-auto mt-12 border-t-2 border-[#9a0002]/10 pt-6">
                        <p
                            class="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-[#9a0002]/60"
                        >
                            Written by
                        </p>
                        <div class="mt-4 grid sm:grid-cols-2 gap-4">
                            {#each post.contributors as contributor}
                                <a
                                    href="/contributors/{contributor.documentId}"
                                    class="group flex items-center gap-3 rounded-lg bg-white border-2 border-[#9a0002]/10 hover:border-[#febd59] shadow-sm hover:shadow-md transition p-3"
                                >
                                    {@render avatar(contributor, 'w-12 h-12 shrink-0')}
                                    <span class="min-w-0">
                                        <span
                                            class="block text-sm md:text-base font-black text-[#9a0002] underline decoration-transparent decoration-2 underline-offset-2 group-hover:decoration-[#febd59] transition truncate"
                                        >
                                            {contributor.name}
                                        </span>
                                        {#if position(contributor)}
                                            <span class="block text-xs text-[#030200]/60 truncate">
                                                {position(contributor)}
                                            </span>
                                        {/if}
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </article>

        <!--More from the forum: the newest other posts, on the shared card-->
        {#if data.related.length}
            <section class="mt-12">
                <div class="flex items-baseline justify-between gap-4">
                    <h2 class="text-xl md:text-2xl font-black text-[#faf8f0]">
                        More from the forum
                    </h2>
                    <a
                        href="/forum"
                        class="text-sm md:text-base font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition whitespace-nowrap"
                    >
                        all posts →
                    </a>
                </div>
                <div class="w-16 h-1 rounded bg-[#febd59] mt-2 mb-6"></div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {#each data.related as relatedPost}
                        <PublicationCard
                            publication={relatedPost}
                            href="/forum/{relatedPost.documentId}"
                            date={relatedPost.publishedAt ?? relatedPost.createdAt}
                            borderColor="#febd59"
                            strapiUrl={data.strapiUrl}
                        />
                    {/each}
                </div>
            </section>
        {/if}
    </div>
</div>
