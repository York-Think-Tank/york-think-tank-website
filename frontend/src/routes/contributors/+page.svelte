<script lang="ts">
    import SearchPage from '$lib/components/search-page.svelte';
    import { formatDate } from '$lib/format';

    let { data } = $props();

    const contributors = $derived(data.contributors);
    const strapiUrl = $derived(data.strapiUrl);
</script>

<SearchPage
    title="CONTRIBUTORS"
    headTitle="Contributors"
    action="/contributors"
    backHref="/#committee"
    q={data.q}
    placeholder="Search contributors by name…"
    hasResults={contributors.length > 0}
    emptyMessage={`No contributors match “${data.q}”.`}
>
    {#snippet results()}
        {#each contributors as contributor}
            <!--Gold-outlined card, matching the publication cards on the other search pages-->
            <a
                href="/contributors/{contributor.documentId}"
                class="group flex flex-col items-center text-center gap-2 rounded-lg border-4 border-[#febd59] hover:border-[#ffc9c2] transition p-4 w-[calc((100%-2rem)/3)] md:w-[calc((100%-4.5rem)/4)]"
            >
                <div class="w-full max-w-32 aspect-square rounded-full overflow-hidden border-4 border-[#febd59] group-hover:border-[#ffc9c2] transition bg-[#febd59]">
                    {#if contributor.photo}
                        <img
                            src="{strapiUrl}{contributor.photo.url}"
                            alt={contributor.photo.alternativeText ?? contributor.name}
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <img
                            src="/images/bulb.avif"
                            alt="York Think Tank logo placeholder for {contributor.name}"
                            class="w-full h-full object-contain p-4"
                        />
                    {/if}
                </div>
                <p class="text-base md:text-lg text-[#faf8f0] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 group-hover:decoration-[#febd59] transition">
                    {contributor.name}
                </p>
                {#if contributor.current_or_past_committee === 'Current' && contributor.current_committee_position}
                    <p class="text-base font-black text-[#febd59]">
                        {contributor.current_committee_position}
                    </p>
                {/if}
                <!--Join date: the entry's createdAt, i.e. when they were added to the CMS-->
                {#if contributor.createdAt}
                    <p class="text-xs md:text-sm text-[#faf8f0]/60">
                        Joined {formatDate(contributor.createdAt)}
                    </p>
                {/if}
            </a>
        {/each}
    {/snippet}
</SearchPage>
