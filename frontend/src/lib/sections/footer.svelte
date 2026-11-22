<script lang="ts">
    let { data }: { data: any } = $props();

    // Empty without a CMS entry so the SU line still renders on its own
    const links: { label: string; url?: string }[] = $derived(data?.links ?? []);
</script>

<!--SU footer strip in burgundy, with the CMS links stacked above the SU line-->
<footer class="bg-[#9a0002] px-4 py-4 text-center text-sm md:text-base text-[#faf8f0]">
    {#if links.length}
        <ul class="space-y-1 mb-1">
            {#each links as link}
                <li>
                    {#if link.url}
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="underline decoration-1 underline-offset-2 hover:decoration-2"
                        >
                            {link.label}
                        </a>
                    {:else}
                        {link.label}
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
    <p>York Think Tank is part of the University of York Students' Union.</p>
    <p class="mt-1 text-xs md:text-sm text-[#faf8f0]/70">
        Site made with ❤️ by
        <a
            href="https://bensonc.how"
            target="_blank"
            rel="noopener noreferrer"
            class="underline decoration-1 underline-offset-2 hover:decoration-2"
        >
            Benson Chow
        </a>
    </p>
</footer>
