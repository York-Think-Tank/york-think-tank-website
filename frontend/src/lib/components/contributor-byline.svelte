<script lang="ts">
    let {
        contributors = [],
        back = null,
        class: className = ''
    }: {
        contributors: any[];
        // Section to return to from a profile (e.g. "/#journals-forum"); encoded into
        // the ?back= query. Omit on search pages, where the router knows the origin
        back?: string | null;
        // Colour and spacing for the wrapping <p>. The surrounding text and the "+ N more"
        // trigger inherit it; the linked name is always solid burgundy
        class?: string;
    } = $props();

    const first = $derived(contributors[0]);
    const hidden = $derived(contributors.slice(1));
    const query = $derived(back ? `?back=${encodeURIComponent(back)}` : '');
</script>

<!--"By <first author> + N more": the first name links to its profile, the rest sit
    behind a hover/focus tooltip. relative on the <p> (not the trigger) keeps that
    tooltip centred on the byline rather than drifting off a near-edge trigger-->
{#if contributors.length}
    <p class="relative {className}">
        By <a
            href="/contributors/{first.documentId}{query}"
            class="font-black text-[#9a0002] underline decoration-[#9a0002] decoration-2 underline-offset-2 hover:decoration-transparent transition"
            >{first.name}</a
        >{#if hidden.length}
            <span
                class="font-black underline decoration-dotted decoration-[#9a0002] cursor-help group/more"
            >
                + {hidden.length} more
                <span
                    class="hidden group-hover/more:block group-focus/more:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 w-max max-w-full rounded bg-[#9a0002] border-2 border-[#febd59] text-[#faf8f0] text-xs px-2 py-1.5"
                >
                    {hidden.map((c: any) => c.name).join(', ')}
                </span>
            </span>
        {/if}
    </p>
{/if}
