<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';

    let { data } = $props();

    const journals = $derived(data.journals);

    // Plain text because each row is itself a link, and links can't nest
    function names(contributors: any[]) {
        const shown = contributors.slice(0, 2).map((c: any) => c.name);
        const rest = contributors.length - shown.length;
        if (rest > 0) return `${shown.join(', ')} & ${rest} more`;
        return shown.join(' & ');
    }
</script>

<!--Journals have no cover images, so results are a volume list rather than a card grid-->
<SearchPage
    title="CIVITAS JOURNALS"
    headTitle="Civitas Journals"
    action="/journals"
    backHref="/#journals-forum"
    q={data.q}
    placeholder="Search journals by title…"
    hasResults={journals.length > 0}
    emptyMessage={data.q ? `No journals match “${data.q}”.` : 'No journals published yet.'}
>
    {#snippet results()}
        <div class="w-full max-w-3xl border-t border-[#febd59]/20">
            {#each journals as journal}
                <a
                    href="{data.strapiUrl}{journal.pdf?.url}"
                    target="_blank"
                    rel="noopener"
                    aria-label="Open the {journal.title} PDF"
                    class="group flex items-center gap-4 md:gap-5 py-4 border-b border-[#febd59]/20"
                >
                    <div class="min-w-0 grow">
                        <p
                            class="text-base md:text-xl font-black text-[#faf8f0] leading-tight underline decoration-[#febd59]/40 decoration-2 underline-offset-4 group-hover:decoration-[#febd59] transition break-words"
                        >
                            {journal.title}
                        </p>
                        {#if journal.contributors?.length}
                            <p class="mt-1 text-xs md:text-sm text-[#faf8f0]/70">
                                By {names(journal.contributors)}
                            </p>
                        {/if}
                    </div>
                    <span
                        class="shrink-0 text-[10px] md:text-sm font-black text-[#9a0002] bg-[#febd59] rounded px-1.5 py-0.5 md:px-2 md:py-1 group-hover:bg-[#faf8f0] transition"
                    >
                        PDF ↗
                    </span>
                </a>
            {/each}
        </div>
    {/snippet}
</SearchPage>
