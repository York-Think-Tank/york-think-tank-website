<script lang="ts">
    import PublicationCard from '$lib/components/publication-card.svelte';

    let { projects = [], strapiUrl }: { projects: any[]; strapiUrl: string } = $props();
</script>

<!--Civitas Policy Projects: same burgundy + gold scheme as the About Us section.
    Shows the newest 6; the button links to the full searchable /projects page-->
<section id="projects" class="bg-[#9a0002] p-8">
    <!--Section title, with a quiet link through to the full searchable projects page,
        mirroring the committee section's contributor link-->
    <h2 class="text-3xl md:text-4xl font-black text-[#febd59] text-center mb-2">
        CIVITAS POLICY PROJECTS
    </h2>
    <p class="text-center mb-8">
        <a
            href="/projects"
            class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
        >
            see all our projects →
        </a>
    </p>

    {#if projects.length}
        <!--Flex (not grid): desktop centers a short last row, mobile stays 2 across
            filling left to right-->
        <div class="flex flex-wrap justify-start md:justify-center gap-4 md:gap-6 w-full md:w-[85vw] mx-auto">
            {#each projects.slice(0, 6) as project}
                <PublicationCard
                    publication={project}
                    href="{strapiUrl}{project.pdf?.url}"
                    external
                    {strapiUrl}
                    bylineBack="/#projects"
                    class="w-[calc((100%-1rem)/2)] md:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
                />
            {/each}
        </div>
    {:else}
        <p class="text-base md:text-lg text-[#faf8f0]/70 text-center">
            Our policy projects are coming soon.
        </p>
    {/if}
</section>
