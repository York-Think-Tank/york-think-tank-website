<script lang="ts">
    let { journal }: { journal: any } = $props();
</script>

<!--Stand-in cover for journal cards (the collection has no cover_image field): the
    shared journal artwork. It's a wide banner, so object-contain shows all of it,
    letterboxed on a burgundy field that matches its own background instead of
    cropping it to the card's ratio. Hover-zooms like the real cover images-->
<div class="w-full h-full bg-[#9a0002] flex items-center justify-center">
    <img
        src="/images/journal.avif"
        alt="Civitas Journal cover for {journal.title}"
        class="w-full h-full object-contain group-hover:scale-105 transition duration-300"
    />
</div>
