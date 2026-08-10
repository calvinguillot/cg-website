<script lang="ts">
	import { resolve } from '$app/paths';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	let { data } = $props();

	const source = $derived(data.source);
</script>

<div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
	<a
		href={resolve('/')}
		class="mb-8 inline-block text-sm text-zinc-500 hover:underline dark:text-zinc-400">Back</a
	>

	<div class="mb-10">
		<img
			src="/pp.webp"
			alt="Calvin Guillot"
			class="h-40 w-40 object-cover sm:h-48 sm:w-48"
			width="192"
			height="192"
		/>
	</div>

	<article
		class="prose max-w-none prose-zinc dark:prose-invert
			prose-headings:font-medium prose-headings:tracking-tight
			prose-a:text-zinc-900 prose-a:underline dark:prose-a:text-zinc-100"
	>
		{#if typeof source === 'string'}
			<SvelteMarkdown {source} />
		{:else}
			<p>Content not available.</p>
		{/if}
	</article>
</div>
