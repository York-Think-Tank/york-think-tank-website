<script lang="ts">
    let { data }: { data: any } = $props();

    type Link = { label: string; url?: string };

    // Placeholder labels keep the section visible without a CMS entry, and a link
    // with no URL renders as plain text instead of a dead link
    const email = $derived(data?.email ?? 'thinktank@yorksu.org');
    const contactLinks: Link[] = $derived(
        data?.contact_links ?? [{ label: 'Instagram' }, { label: 'LinkedIn' }, { label: 'YouTube' }]
    );
    const joinLinks: Link[] = $derived(
        data?.join_links ?? [{ label: 'Membership' }, { label: 'WhatsApp' }, { label: 'Become a Writer' }]
    );
</script>

<!--Link list shared by both layouts, with the email only under Contact Us-->
{#snippet linkList(links: Link[], sizes: string, withEmail = false)}
    <ul class="space-y-1 md:space-y-2">
        {#if withEmail}
            <li class="{sizes} text-[#9a0002]">
                <a href="mailto:{email}" class="underline decoration-2 underline-offset-4">{email}</a>
            </li>
        {/if}
        {#each links as link}
            <li class="{sizes} text-[#9a0002]">
                {#if link.url}
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="hover:underline decoration-2 underline-offset-4"
                    >
                        {link.label}
                    </a>
                {:else}
                    {link.label}
                {/if}
            </li>
        {/each}
    </ul>
{/snippet}

<!--Contact Us / Join Us: the concept's split panel, gold half + white half with
    the bulb logo over the seam-->
<section id="contact">
    <!--Desktop: gold/white split behind three columns so the bulb owns the middle
        one and never covers text, and both halves share one subgrid so headings line up-->
    <div
        class="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:grid-rows-[1fr_auto_1fr] min-h-[60vh] py-14 bg-[linear-gradient(to_right,#febd59_50%,#e8eef5_50%)]"
    >
        {#snippet half(title: string, links: Link[], withEmail = false)}
            <div class="row-start-2 w-full max-w-md lg:max-w-lg mx-auto">
                <h2 class="text-4xl lg:text-5xl font-black text-black text-left leading-tight mb-10">
                    {title}
                </h2>
                {@render linkList(links, 'text-xl', withEmail)}
            </div>
        {/snippet}

        <div class="row-span-3 grid grid-rows-subgrid pl-8 pr-6">
            {@render half('Contact Us', contactLinks, true)}
        </div>
        <!--Width is about 0.53x height, which crops the transparent sides of the 460x512 image-->
        <img
            src="/images/bulb.avif"
            alt=""
            class="row-span-3 self-center h-72 w-40 lg:h-96 lg:w-52 xl:h-[30rem] xl:w-64 object-cover"
        />
        <div class="row-span-3 grid grid-rows-subgrid pl-6 pr-8">
            {@render half('Join Us', joinLinks)}
        </div>
    </div>

    <!--Mobile: single white column so the page keeps its red/white alternation
        (events above and the footer below are red); gold stays an accent under
        the headings instead of a full-width band-->
    <div class="md:hidden bg-[#e8eef5] px-8 py-12 min-h-[60vh] flex flex-col justify-center gap-10">
        <img src="/images/bulb.avif" alt="" class="h-28 w-auto mx-auto" />
        {#snippet mobileBlock(title: string, links: Link[], withEmail = false)}
            <div class="w-full max-w-sm mx-auto">
                <h2 class="text-3xl font-black text-black leading-tight">{title}</h2>
                <div class="w-16 h-1 rounded bg-[#febd59] mt-2 mb-5"></div>
                {@render linkList(links, 'text-base', withEmail)}
            </div>
        {/snippet}
        {@render mobileBlock('Contact Us', contactLinks, true)}
        {@render mobileBlock('Join Us', joinLinks)}
    </div>
</section>
