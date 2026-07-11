<script lang="ts">
    import EventCard from '$lib/components/event-card.svelte';
    import { splitEvents } from '$lib/format';

    let { events = [], strapiUrl }: { events: any[]; strapiUrl: string } = $props();

    const split = $derived(splitEvents(events));
</script>

<!--Upcoming/Previous subsection: gold heading + underline bar, then up to three cards.
    Hidden entirely while its half has nothing to show-->
{#snippet group(label: string, list: any[])}
    {#if list.length}
        <div>
            <h3 class="text-2xl md:text-3xl font-black text-[#febd59]">{label}</h3>
            <div class="w-16 h-1 rounded bg-[#febd59] mt-2 mb-4"></div>
            <!--Same card widths as the Civitas Policy Projects grid; up to four per
                group, one full row at xl-->
            <div class="flex flex-wrap gap-4 md:gap-6">
                {#each list.slice(0, 4) as event}
                    <EventCard
                        {event}
                        {strapiUrl}
                        borderColor="#febd59"
                        class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                    />
                {/each}
            </div>
        </div>
    {/if}
{/snippet}

<!--Our Events: the concept mockup's Upcoming/Previous split, recoloured onto the
    site's burgundy + gold scheme (same as the Projects section)-->
<section id="events" class="bg-[#9a0002] px-8 py-6">
    <h2 class="text-3xl md:text-4xl font-black text-[#febd59] text-center mb-2">OUR EVENTS</h2>
    <p class="text-center mb-6">
        <a
            href="/events"
            class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
        >
            see all our events →
        </a>
    </p>

    {#if events.length}
        <div class="w-full md:w-[85vw] mx-auto space-y-6 md:space-y-8">
            {@render group('Upcoming', split.upcoming)}
            {@render group('Previous', split.previous)}
        </div>
    {:else}
        <p class="text-base md:text-lg text-[#faf8f0]/70 text-center">
            Our events are coming soon.
        </p>
    {/if}
</section>
