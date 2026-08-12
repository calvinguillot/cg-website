<script lang="ts">
	import { resolve } from '$app/paths';
	import SvelteMarkdown from '@humanspeak/svelte-markdown';

	let { data } = $props();

	const project = $derived(data.project);
	const source = $derived(data.source);
</script>

<div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
	<a
		href={resolve('/')}
		class="mb-8 inline-block text-sm text-zinc-500 hover:underline dark:text-zinc-400">Back</a
	>

	<!-- <header class="mb-10">
		<p class="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
			{project.year}
			{#if project.location}
				<span aria-hidden="true"> · </span>{project.location}
			{/if}
		</p>
		<h1 class="text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
			{project.title}
		</h1>
	</header> -->

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
