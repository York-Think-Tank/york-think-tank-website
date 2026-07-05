<script lang="ts">
    let { members = [], strapiUrl }: { members: any[]; strapiUrl: string } = $props();
</script>

<section class="bg-[#ffc9c2] p-8">
    <!--Committee title-->
    <h2 class="text-3xl md:text-4xl font-black text-[#9a0002] text-center mb-8">
        OUR COMMITTEE
    </h2>

    <!--Member cards: 3 across on mobile, 4 across on desktop.
        Flex + justify-center (not grid) so a short last row centers instead of left-aligning;
        card widths are computed from the row's gap total so full rows still fill exactly-->
    <div class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-10 max-w-6xl mx-auto">
        {#each members as member}
            <!--Whole card links to the member page (documentId is Strapi's unique entry id);
                underline is the persistent clickable cue,
                border flips burgundy->gold on hover for desktop feedback-->
            <a
                href="/members/{member.documentId}"
                class="group flex flex-col items-center text-center gap-3 w-[calc((100%-2rem)/3)] md:w-[calc((100%-4.5rem)/4)]"
            >
                <h3 class="text-base md:text-2xl font-black text-[#9a0002] leading-tight">
                    {member.current_committee_position ?? 'Committee Member'}
                </h3>
                <div class="w-full max-w-44 aspect-square rounded-full overflow-hidden border-4 border-[#9a0002] group-hover:border-[#febd59] transition bg-[#febd59]">
                    {#if member.photo}
                        <img
                            src="{strapiUrl}{member.photo.url}"
                            alt={member.photo.alternativeText ?? member.name}
                            class="w-full h-full object-cover"
                        />
                    {:else}
                        <!--Default: YTT bulb logo on brand gold, like the header-->
                        <img
                            src="/images/bulb.avif"
                            alt="York Think Tank logo placeholder for {member.name}"
                            class="w-full h-full object-contain p-6"
                        />
                    {/if}
                </div>
                <p class="text-base md:text-lg text-[#030200] underline decoration-[#9a0002]/40 decoration-2 underline-offset-4 group-hover:decoration-[#9a0002] transition">
                    {member.name}
                </p>
            </a>
        {/each}
    </div>
</section>
