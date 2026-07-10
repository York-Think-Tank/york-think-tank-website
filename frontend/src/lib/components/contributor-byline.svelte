<script lang="ts">
    let {
        contributors = [],
        back = null,
        color = null,
        class: className = ''
    }: {
        contributors: any[];
        // Section to return to from a profile (e.g. "/#journals-forum"); encoded into
        // the ?back= query. Omit on search pages, where the router knows the origin
        back?: string | null;
        // Accent for the linked name and the "N others" underline. When set, the whole
        // byline (including the "By" text) takes it; leave null to keep a burgundy link
        // over a wrapper colour driven by `class` (e.g. the grey journal byline)
        color?: string | null;
        // Colour and spacing for the wrapping <p>. The surrounding text and the "N others"
        // trigger inherit it unless `color` overrides
        class?: string;
    } = $props();

    const first = $derived(contributors[0]);
    const hidden = $derived(contributors.slice(1));
    const query = $derived(back ? `?back=${encodeURIComponent(back)}` : '');
    // Links/underlines default to burgundy; `color`, when given, themes the whole byline
    const accent = $derived(color ?? '#9a0002');
</script>

<!--"By <first author> and N others": the first name links to its profile, the rest sit
    behind a hover/focus tooltip. relative on the <p> (not the trigger) keeps that
    tooltip centred on the byline rather than drifting off a near-edge trigger.
    text-xs md:text-sm is the standard byline size everywhere; `class` only adds
    colour/spacing on top-->
{#if contributors.length}
    <p class="relative text-xs md:text-sm {className}" style={color ? `color: ${color}` : ''}>
        By <a
            href="/contributors/{first.documentId}{query}"
            class="font-black underline decoration-current decoration-2 underline-offset-2 hover:decoration-transparent transition"
            style="color: {accent}"
            >{first.name}</a
        >{#if hidden.length}
            <!--Reads as a sentence, "By X and 3 others", with the count as the tooltip
                trigger. Svelte trims whitespace around the block, so the spaces are
                explicit; the trigger's underline matches the name link's offset/weight
                so the two sit on one baseline, and nowrap keeps "3 others" together-->
            {' '}and{' '}<span
                class="font-black underline decoration-dotted decoration-2 underline-offset-2 cursor-help whitespace-nowrap group/more"
                style="text-decoration-color: {accent}"
            >
                {hidden.length} {hidden.length === 1 ? 'other' : 'others'}
                <!--whitespace-normal undoes the trigger's inherited nowrap so a long
                    name list wraps inside the tooltip instead of overflowing the card-->
                <span
                    class="hidden group-hover/more:block group-focus/more:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 w-max max-w-full whitespace-normal rounded bg-[#9a0002] border-2 border-[#febd59] text-[#faf8f0] text-xs px-2 py-1.5"
                >
                    {hidden.map((c: any) => c.name).join(', ')}
                </span>
            </span>
        {/if}
    </p>
{/if}
