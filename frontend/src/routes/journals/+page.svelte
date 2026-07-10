<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';
    import PublicationCard from '$lib/components/publication-card.svelte';
    import JournalCover from '$lib/components/journal-cover.svelte';

    let { data } = $props();

    const journals = $derived(data.journals);
</script>

{#snippet journalCover(journal: any)}
    <JournalCover {journal} />
{/snippet}

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
        {#each journals as journal}
            <PublicationCard
                publication={journal}
                href="{data.strapiUrl}{journal.pdf?.url}"
                external
                date={journal.publishedAt ?? journal.createdAt}
                coverFallback={journalCover}
                borderColor="#febd59"
                strapiUrl={data.strapiUrl}
                class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)]"
            />
        {/each}
    {/snippet}
</SearchPage>
