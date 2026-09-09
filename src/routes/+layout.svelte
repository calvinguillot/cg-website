<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { page } from '$app/state';
	import { MetaTags, deepMerge } from 'svelte-meta-tags';
	import type { MetaTagsProps } from 'svelte-meta-tags';
	import type { Snippet } from 'svelte';

	interface LayoutData {
		baseMetaTags: MetaTagsProps;
	}

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	const metaTags = $derived(deepMerge(data.baseMetaTags, page.data.pageMetaTags ?? {}));
</script>

<MetaTags {...metaTags} />

<div
	class="flex min-h-dvh flex-col bg-white text-zinc-900 antialiased dark:bg-black dark:text-zinc-100"
>
	<Nav />
	<main class="grow">
		{@render children()}
	</main>
	<Footer />
</div>
