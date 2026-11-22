<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Square raster icons at fixed root paths for search results and iOS home screens, SVG for browser tabs -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32" />
	<link rel="icon" href="/favicon.png" type="image/png" sizes="192x192" />
	<link rel="icon" href={favicon} type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
{@render children()}
