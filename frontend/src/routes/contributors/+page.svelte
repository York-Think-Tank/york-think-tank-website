<script lang="ts">
    let { data } = $props();

    const contributors = $derived(data.contributors);
    const strapiUrl = $derived(data.strapiUrl);
</script>

<svelte:head>
    <title>Contributors for York Think Tank</title>
</svelte:head>

<div class="min-h-dvh bg-[#9a0002] p-6 md:p-8">
    <div class="max-w-5xl mx-auto">
        <a
            href="/"
            class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
        >
            ← Back to home
        </a>

        <h1 class="text-3xl md:text-4xl font-black text-[#febd59] text-center mt-6 mb-6">
            CONTRIBUTORS
        </h1>

        <!--GET form: SvelteKit navigates to /contributors?q=... and the server filters by name-->
        <form action="/contributors" method="get" class="max-w-xl mx-auto mb-10">
            <input
                type="search"
                name="q"
                value={data.q}
                placeholder="Search contributors by name…"
                class="w-full rounded bg-[#faf8f0] text-[#030200] placeholder-[#030200]/50 px-4 py-2 border-2 border-[#febd59] focus:outline-none focus:border-[#ffc9c2]"
            />
        </form>

        {#if contributors.length}
            <div class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-8">
                {#each contributors as contributor}
                    <a
                        href="/contributors/{contributor.documentId}"
                        class="group flex flex-col items-center text-center gap-2 w-[calc((100%-2rem)/3)] md:w-[calc((100%-4.5rem)/4)]"
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
                    </a>
                {/each}
            </div>
        {:else}
            <p class="text-base md:text-lg text-[#faf8f0] text-center">
                No contributors match “{data.q}”.
            </p>
        {/if}
    </div>
</div>
