<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';
    import EventCard from '$lib/components/event-card.svelte';
    import { splitEvents } from '$lib/format';

    let { data } = $props();

    const split = $derived(splitEvents(data.events));
    const groups = $derived([
        { label: 'Upcoming', list: split.upcoming },
        { label: 'Previous', list: split.previous }
    ]);
</script>

<SearchPage
    title="OUR EVENTS"
    headTitle="Our Events"
    action="/events"
    backHref="/#events"
    q={data.q}
    placeholder="Search events by title…"
    hasResults={data.events.length > 0}
    emptyMessage={data.q ? `No events match “${data.q}”.` : 'No events published yet.'}
>
    {#snippet results()}
        <!--w-full headings claim a whole flex row, splitting the shared results area
            into the Upcoming and Previous groups from the homepage section-->
        {#each groups as group}
            {#if group.list.length}
                <h2 class="w-full text-2xl md:text-3xl font-black text-[#febd59]">
                    {group.label}
                </h2>
                {#each group.list as event}
                    <EventCard
                        {event}
                        strapiUrl={data.strapiUrl}
                        borderColor="#febd59"
                        class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)]"
                    />
                {/each}
            {/if}
        {/each}
    {/snippet}
</SearchPage>
