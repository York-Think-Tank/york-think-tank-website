<script lang="ts">
    let { members = [], strapiUrl }: { members: any[]; strapiUrl: string } = $props();
</script>

<section id="committee" class="bg-[#e8eef5] p-8 min-h-[60vh] flex flex-col justify-center">
    <!--Committee title, with a quiet link through to the full contributor search page-->
    <h2 class="text-3xl md:text-5xl font-black text-[#9a0002] text-center mb-2">
        OUR COMMITTEE
    </h2>
    <p class="text-center mb-8">
        <a
            href="/contributors"
            class="text-base md:text-xl font-black text-[#9a0002] underline decoration-[#9a0002]/40 decoration-2 underline-offset-4 hover:decoration-[#9a0002] transition"
        >
            and our other contributors →
        </a>
    </p>

    <!--Member cards: 3 across on mobile, 4 across on desktop.
        Flex + justify-center (not grid) so a short last row centers instead of left-aligning;
        cards are exact 1/3 / 1/4 fractions with the gutter as internal padding, so their
        size never depends on how many members there are-->
    <!--w-full matters: inside the section's flex-col, mx-auto alone makes this div
        shrink-to-fit its content, and the percentage card widths then track member
        count instead of the page-->
    <div class="flex flex-wrap justify-center gap-y-10 w-full max-w-6xl mx-auto">
        {#each members as member}
            <!--Whole card links to the member page (documentId is Strapi's unique entry id);
                underline is the persistent clickable cue,
                border flips burgundy->gold on hover for desktop feedback-->
            <a
                href="/contributors/{member.documentId}?back=/%23committee"
                class="group flex flex-col items-center text-center gap-3 w-1/3 md:w-1/4 px-2 md:px-3"
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
                <p class="text-base md:text-xl text-[#030200] underline decoration-[#9a0002]/40 decoration-2 underline-offset-4 group-hover:decoration-[#9a0002] transition">
                    {member.name}
                </p>
            </a>
        {/each}
    </div>
</section>
