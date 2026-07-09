<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';
    import PublicationCard from '$lib/components/publication-card.svelte';

    let { data } = $props();

    const projects = $derived(data.projects);
</script>

<SearchPage
    title="CIVITAS POLICY PROJECTS"
    headTitle="Civitas Policy Projects"
    action="/projects"
    backHref="/#projects"
    q={data.q}
    placeholder="Search projects by title…"
    hasResults={projects.length > 0}
    emptyMessage={data.q ? `No projects match “${data.q}”.` : 'No projects published yet.'}
>
    {#snippet results()}
        {#each projects as project}
            <PublicationCard
                publication={project}
                href="{data.strapiUrl}{project.pdf?.url}"
                external
                strapiUrl={data.strapiUrl}
                class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)]"
            />
        {/each}
    {/snippet}
</SearchPage>
