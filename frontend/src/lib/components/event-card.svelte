<script lang="ts">
    import { dateStamp, formatTime } from '$lib/format';

    let {
        event,
        strapiUrl,
        borderColor = '#9a0002',
        class: className = ''
    }: {
        event: any;
        strapiUrl: string;
        // Outline colour, like PublicationCard: gold when the card sits on burgundy
        borderColor?: string;
        class?: string;
    } = $props();

    const stamp = $derived(dateStamp(event.event_date));
    const time = $derived(formatTime(event.event_date));
    // The sign-up button only makes sense while the event is still ahead
    const upcoming = $derived(new Date(event.event_date).getTime() >= Date.now());
</script>

<!--Event card: PublicationCard's frame (cover on top, white body, 4px outline) but for
    events - no PDF or detail page to link to, so the card is informational. The journals'
    calendar-style date stamp sits beside the title, and upcoming events with a sign-up
    link get the gold pill button used across the site-->
<div
    class="flex flex-col rounded-lg border-4 bg-white shadow-sm hover:shadow-md transition {className}"
    style="border-color: {borderColor}"
>
    <div class="relative aspect-[4/3] overflow-hidden rounded-t-[4px] bg-[#faf8f0]">
        {#if event.cover_image}
            <img
                src="{strapiUrl}{event.cover_image.url}"
                alt={event.cover_image.alternativeText ?? event.title}
                class="w-full h-full object-cover"
            />
        {/if}
    </div>
    <div class="grow flex flex-col p-3">
        <div class="flex items-start gap-3">
            <!--Calendar-style date stamp (visual only), as on the journals rail-->
            {#if stamp}
                <div
                    aria-hidden="true"
                    class="shrink-0 w-11 md:w-12 text-center leading-none border-r-2 border-[#febd59] pr-2.5 md:pr-3"
                >
                    <span
                        class="block text-[10px] md:text-xs font-black uppercase tracking-wide text-[#9a0002]"
                    >
                        {stamp.month}
                    </span>
                    <span class="block my-0.5 text-lg md:text-xl font-black text-[#9a0002]">
                        {stamp.day}
                    </span>
                    <span class="block text-[10px] md:text-xs font-black text-[#030200]/50">
                        {stamp.year}
                    </span>
                </div>
            {/if}
            <div class="min-w-0">
                <p class="text-sm md:text-base font-black leading-tight line-clamp-2 text-[#9a0002]">
                    {event.title}
                </p>
                <!--Time and location share one wrapping meta row; inline SVGs rather than
                    emoji so the icons render the same in every font stack-->
                <div
                    class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs md:text-sm text-[#030200]/60"
                >
                    {#if time}
                        <span class="inline-flex items-center gap-1 min-w-0">
                            <svg
                                aria-hidden="true"
                                class="w-3.5 h-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span class="truncate">{time}</span>
                        </span>
                    {/if}
                    {#if event.location}
                        <span class="inline-flex items-center gap-1 min-w-0">
                            <svg
                                aria-hidden="true"
                                class="w-3.5 h-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                />
                            </svg>
                            <span class="truncate">{event.location}</span>
                        </span>
                    {/if}
                </div>
            </div>
        </div>
        <!--Dedicated bio panel under a gold rule, with room for a longer description-->
        <p
            class="mt-2 pt-2 border-t-2 border-[#febd59]/40 text-xs md:text-sm leading-snug text-[#030200]/70 line-clamp-6"
        >
            {event.description}
        </p>
        {#if upcoming && event.signup_link}
            <!--mt-auto pins the button to the card's bottom edge across a row of cards-->
            <p class="mt-auto pt-3">
                <a
                    href={event.signup_link}
                    target="_blank"
                    rel="noopener"
                    class="inline-block text-[10px] md:text-sm font-black text-[#9a0002] border-2 border-[#febd59] rounded px-2 py-1 hover:bg-[#9a0002] hover:border-[#9a0002] hover:text-[#febd59] transition"
                >
                    Sign up ↗
                </a>
            </p>
        {/if}
    </div>
</div>
