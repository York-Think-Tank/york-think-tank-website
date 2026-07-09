<script lang="ts">
    import { afterNavigate } from '$app/navigation';
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
</script>

<svelte:head>
    <title>{post.title} - Civitas Forum</title>
</svelte:head>

<!--Inline children of a rich text block: plain/bold/italic/underlined text and links.
    Recursive so links can carry styled text inside them-->
{#snippet inline(children: any[])}
    {#each children as child}
        {#if child.type === 'link'}
            <a
                href={child.url}
                target="_blank"
                rel="noopener"
                class="underline decoration-[#febd59]/60 decoration-2 underline-offset-2 hover:decoration-[#febd59] transition"
            >{@render inline(child.children ?? [])}</a>
        {:else if child.bold}<strong>{child.text}</strong>
        {:else if child.italic}<em>{child.text}</em>
        {:else if child.underline}<span class="underline">{child.text}</span>
        {:else}{child.text}{/if}
    {/each}
{/snippet}

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
            <h1 class="text-3xl md:text-4xl font-black text-[#faf8f0] leading-tight">
                {post.title}
            </h1>

            <!--Byline: every contributor linked, plus the publish date-->
            <p class="mt-3 mb-6 text-base md:text-lg text-[#faf8f0]/80">
                {#if post.contributors?.length}
                    By
                    {#each post.contributors as contributor, i}
                        <a
                            href="/contributors/{contributor.documentId}"
                            class="font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-2 hover:decoration-[#febd59] transition"
                        >{contributor.name}</a>{i < post.contributors.length - 1 ? ', ' : ''}
                    {/each}
                {/if}
                {#if published}
                    <span class="whitespace-nowrap">· {published}</span>
                {/if}
            </p>

            {#if post.cover_image}
                <img
                    src="{strapiUrl}{post.cover_image.url}"
                    alt={post.cover_image.alternativeText ?? post.title}
                    class="w-full max-h-96 object-cover rounded border-2 border-[#febd59] mb-8"
                />
            {/if}

            <!--Strapi rich text blocks: paragraphs, headings, lists, quotes and images-->
            <div class="text-base md:text-lg text-[#faf8f0]">
                {#each post.content ?? [] as block}
                    {#if block.type === 'paragraph'}
                        <p class="mb-4">{@render inline(block.children)}</p>
                    {:else if block.type === 'heading' && block.level <= 2}
                        <h2 class="text-xl md:text-2xl font-black text-[#febd59] mt-8 mb-3">
                            {@render inline(block.children)}
                        </h2>
                    {:else if block.type === 'heading'}
                        <h3 class="text-lg md:text-xl font-black text-[#febd59] mt-6 mb-2">
                            {@render inline(block.children)}
                        </h3>
                    {:else if block.type === 'list' && block.format === 'ordered'}
                        <ol class="list-decimal pl-6 mb-4 space-y-1">
                            {#each block.children as item}
                                <li>{@render inline(item.children ?? [])}</li>
                            {/each}
                        </ol>
                    {:else if block.type === 'list'}
                        <ul class="list-disc pl-6 mb-4 space-y-1">
                            {#each block.children as item}
                                <li>{@render inline(item.children ?? [])}</li>
                            {/each}
                        </ul>
                    {:else if block.type === 'quote'}
                        <blockquote class="border-l-4 border-[#febd59] pl-4 italic mb-4 text-[#faf8f0]/90">
                            {@render inline(block.children)}
                        </blockquote>
                    {:else if block.type === 'image' && block.image}
                        <img
                            src={block.image.url.startsWith('/')
                                ? `${strapiUrl}${block.image.url}`
                                : block.image.url}
                            alt={block.image.alternativeText ?? ''}
                            class="rounded my-6 max-w-full mx-auto"
                        />
                    {/if}
                {/each}
            </div>
        </article>
    </div>
</div>
