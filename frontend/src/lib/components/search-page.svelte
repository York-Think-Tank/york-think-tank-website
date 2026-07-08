<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        title,
        headTitle = title,
        action,
        backHref = '/',
        q = '',
        placeholder,
        hasResults,
        emptyMessage,
        results
    }: {
        title: string;
        headTitle?: string;
        action: string;
        backHref?: string;
        q?: string;
        placeholder: string;
        hasResults: boolean;
        emptyMessage: string;
        results: Snippet;
    } = $props();
</script>

<!--Shared search-page template: burgundy full-height page with a back link, centered
    title, GET search form, and a flex-wrap results area rendered via the results snippet.
    Used by /contributors and /projects; Civitas Forum and Journals reuse it the same way-->
<svelte:head>
    <title>{headTitle} — York Think Tank</title>
</svelte:head>

<div class="min-h-dvh bg-[#9a0002] p-6 md:p-8">
    <div class="max-w-5xl mx-auto">
        <a
            href={backHref}
            class="text-base md:text-lg font-black text-[#febd59] underline decoration-[#febd59]/40 decoration-2 underline-offset-4 hover:decoration-[#febd59] transition"
        >
            ← Back to home
        </a>

        <h1 class="text-3xl md:text-4xl font-black text-[#febd59] text-center mt-6 mb-6">
            {title}
        </h1>

        <!--GET form: navigates to ?q=... and the server filters-->
        <form {action} method="get" class="max-w-xl mx-auto mb-10">
            <input
                type="search"
                name="q"
                value={q}
                {placeholder}
                class="w-full rounded bg-[#faf8f0] text-[#030200] placeholder-[#030200]/50 px-4 py-2 border-2 border-[#febd59] focus:outline-none focus:border-[#ffc9c2]"
            />
        </form>

        {#if hasResults}
            <div class="flex flex-wrap justify-center gap-x-4 md:gap-x-6 gap-y-8">
                {@render results()}
            </div>
        {:else}
            <p class="text-base md:text-lg text-[#faf8f0] text-center">
                {emptyMessage}
            </p>
        {/if}
    </div>
</div>
