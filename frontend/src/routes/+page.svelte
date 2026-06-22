<script lang="ts">
    import Header from '$lib/sections/header.svelte';
    import About from '$lib/sections/about.svelte';
    import Committee from '$lib/sections/committee.svelte';
    import Projects from '$lib/sections/projects.svelte';
    import JournalsForums from '$lib/sections/journals-forums.svelte';
    import Events from '$lib/sections/events.svelte';

    let { data } = $props();
</script>

<Header />
<About data={data.aboutPage} strapiUrl={data.strapiUrl} />
<Committee />
<Projects />
<JournalsForums />
<Events />