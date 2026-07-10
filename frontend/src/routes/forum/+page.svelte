<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';
    import PublicationCard from '$lib/components/publication-card.svelte';

    let { data } = $props();

    const forumPosts = $derived(data.forumPosts);
</script>

<SearchPage
    title="CIVITAS FORUM"
    headTitle="Civitas Forum"
    action="/forum"
    backHref="/#journals-forum"
    q={data.q}
    placeholder="Search forum posts by title…"
    hasResults={forumPosts.length > 0}
    emptyMessage={data.q ? `No forum posts match “${data.q}”.` : 'No forum posts published yet.'}
>
    {#snippet results()}
        {#each forumPosts as post}
            <PublicationCard
                publication={post}
                href="/forum/{post.documentId}"
                date={post.publishedAt ?? post.createdAt}
                borderColor="#febd59"
                strapiUrl={data.strapiUrl}
                class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)]"
            />
        {/each}
    {/snippet}
</SearchPage>
