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

	<div class="flex flex-col items-center text-left sm:items-start sm:text-left">
		<article
			class="prose max-w-none prose-zinc dark:prose-invert
			prose-headings:font-medium prose-headings:tracking-tight
			prose-a:text-zinc-900 prose-a:underline dark:prose-a:text-zinc-100
			prose-img:rounded-none"
		>
			{#if typeof source === 'string'}
				<SvelteMarkdown {source} />
			{:else}
				<p>Content not available.</p>
			{/if}
		</article>
	</div>
</div>
