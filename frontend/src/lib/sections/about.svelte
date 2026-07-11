<script lang="ts">
    let { data, strapiUrl }: { data: any; strapiUrl: string } = $props();

    const images = $derived(data.about_images);
    const aboutParagraphs = $derived(data.about);
    const missionItems = $derived(data.mission[0].children);
</script>

<section class="bg-[#9a0002] p-8 min-h-[60vh] flex flex-col justify-center">
    <!--About us title-->
    <h2 class="text-3xl md:text-5xl font-black text-[#febd59] text-center mb-8">
        ABOUT US
    </h2>
    <!--About us text section-->
    <!--mx-auto to center the div-->
    <div class="text-base md:text-xl text-[#faf8f0] mb-6 max-w-6xl mx-auto">
        {#each aboutParagraphs as paragraph}
            <p class="mb-4">
                {paragraph.children[0].text}
            </p>
        {/each}

        <h3 class="text-2xl md:text-4xl font-black text-[#febd59] mb-4">
            Our Mission
        </h3>

        <ul class="space-y-3">
            {#each missionItems as item}
                <li class="flex gap-3">
                    <span class="text-[#febd59] font-black mt-1">•</span>
                    <p>{item.children[0].text}</p>
                </li>
            {/each}
        </ul>
    </div>

    <!--About us images-->
    <div class="flex gap-3 max-w-6xl mx-auto">
        {#each images as image}
            <!--Use a flex container and each image becomes flex item, remove overflow that is not in the 4/3 aspect ratio-->
            <div class="aspect-[4/3] flex-1 overflow-hidden rounded">
                <img
                    src="{strapiUrl}{image.url}"
                    alt={image.alternativeText ?? image.name}
                    class="w-full h-full object-cover"
                />
            </div>
        {/each}
    </div>
</section>