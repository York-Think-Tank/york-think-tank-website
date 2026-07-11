<script lang="ts">
    let { data }: { data: any } = $props();

    // Section always renders; CMS entry fills in the destinations. A label
    // without its URL set shows as plain text instead of a dead link
    const email = $derived(data?.email ?? 'thinktank@yorksu.org');
    const socials = $derived([
        { label: 'Instagram', url: data?.instagram_url },
        { label: 'LinkedIn', url: data?.linkedin_url },
        { label: 'YouTube', url: data?.youtube_url }
    ]);
    const joinLinks = $derived([
        { label: 'Membership', url: data?.membership_url },
        { label: 'WhatsApp', url: data?.whatsapp_url }
    ]);
</script>

<!--Email + link list shared by both layouts-->
{#snippet linkList(links: { label: string; url?: string }[], sizes: string)}
    <a
        href="mailto:{email}"
        class="block w-fit {sizes} text-[#9a0002] underline decoration-2 underline-offset-4"
    >
        {email}
    </a>
    <ul class="mt-6 md:mt-12 space-y-1 md:space-y-2">
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
    the bulb logo over the seam, then the SU footer strip in burgundy-->
<section id="contact" class="relative">
    <!--Desktop: gold/white split panel; halves alone clear the 60vh floor and
        center their content in the extra room-->
    <div class="hidden md:grid md:grid-cols-2 min-h-[60vh]">
        {#snippet half(title: string, links: { label: string; url?: string }[])}
            <div class="h-full flex flex-col justify-center px-8 py-14">
                <div class="w-full max-w-md lg:max-w-lg mx-auto">
                    <h2 class="text-5xl font-black text-black text-left leading-tight mb-10">
                        {title}
                    </h2>
                    {@render linkList(links, 'text-xl')}
                </div>
            </div>
        {/snippet}

        <div class="bg-[#febd59]">
            {@render half('Contact Us', socials)}
        </div>
        <div class="bg-[#e8eef5]">
            {@render half('Join Us', joinLinks)}
        </div>
    </div>

    <!--Bulb sits over the desktop gold/white boundary-->
    <img
        src="/images/bulb.avif"
        alt=""
        class="hidden md:block absolute left-1/2 -translate-x-1/2 top-10 h-96 lg:h-[30rem] w-auto pointer-events-none"
    />

    <!--Mobile: single white column so the page keeps its red/white alternation
        (events above and the footer below are red); gold stays an accent under
        the headings instead of a full-width band-->
    <div class="md:hidden bg-[#e8eef5] px-8 py-12 min-h-[60vh] flex flex-col justify-center gap-10">
        <img src="/images/bulb.avif" alt="" class="h-28 w-auto mx-auto" />
        {#snippet mobileBlock(title: string, links: { label: string; url?: string }[])}
            <div class="w-full max-w-sm mx-auto">
                <h2 class="text-3xl font-black text-black leading-tight">{title}</h2>
                <div class="w-16 h-1 rounded bg-[#febd59] mt-2 mb-5"></div>
                {@render linkList(links, 'text-base')}
            </div>
        {/snippet}
        {@render mobileBlock('Contact Us', socials)}
        {@render mobileBlock('Join Us', joinLinks)}
    </div>

    <footer class="bg-[#9a0002] px-4 py-4 text-center text-sm md:text-base text-[#faf8f0]">
        York Think Tank is part of the University of York Students' Union.
        {#if data?.terms_url}
            <a
                href={data.terms_url}
                target="_blank"
                rel="noopener noreferrer"
                class="underline decoration-1 underline-offset-2 hover:decoration-2"
            >
                York SU Terms and Conditions.
            </a>
        {/if}
        {#if data?.disclaimer_url}
            <a
                href={data.disclaimer_url}
                target="_blank"
                rel="noopener noreferrer"
                class="underline decoration-1 underline-offset-2 hover:decoration-2"
            >
                UoY Disclaimer.
            </a>
        {/if}
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
</section>
