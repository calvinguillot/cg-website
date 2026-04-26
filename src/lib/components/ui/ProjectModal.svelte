<script lang="ts">
	import { fade } from 'svelte/transition';
	import type { CvGraphNode } from '$lib/types/cv-graph';

	let {
		node,
		onclose
	}: {
		node: CvGraphNode;
		onclose: () => void;
	} = $props();

	function onBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={onKeydown} />

<div
	class="pointer-events-auto fixed inset-0 z-30 flex items-center justify-center p-4 md:p-8"
	transition:fade={{ duration: 180 }}
	role="presentation"
	onclick={onBackdropClick}
>
	<div
		class="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-black/55 p-6 shadow-2xl backdrop-blur-xl md:p-8"
		transition:fade={{ duration: 220, delay: 40 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby="project-modal-title"
		tabindex="-1"
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
	>
		<div class="mb-4 flex flex-wrap items-start justify-between gap-3">
			<div>
				<p class="text-xs font-medium tracking-wider text-cyan-300/90 uppercase">
					{node.type} · {node.yearBucket}
				</p>
				<h2 id="project-modal-title" class="mt-1 text-xl font-semibold text-white md:text-2xl">
					{node.title}
				</h2>
				<p class="mt-1 text-sm text-zinc-400">{node.location}</p>
				{#if node.medium}
					<p class="text-sm text-zinc-500">{node.medium}</p>
				{/if}
			</div>
			<button
				type="button"
				class="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-white/10"
				onclick={onclose}
			>
				Close
			</button>
		</div>

		<p class="mb-4 text-sm leading-relaxed text-zinc-300">{node.description}</p>

		{#if node.technologies?.length}
			<div class="mb-4">
				<p class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Technologies</p>
				<div class="flex flex-wrap gap-2">
					{#each node.technologies as tech (tech)}
						<span
							class="rounded-full border border-cyan-500/25 bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-100"
							>{tech}</span
						>
					{/each}
				</div>
			</div>
		{/if}

		{#if node.collaborators?.length}
			<div class="mb-4">
				<p class="mb-1 text-xs font-medium tracking-wide text-zinc-500 uppercase">Collaborators</p>
				<p class="text-sm text-zinc-400">{node.collaborators.join(', ')}</p>
			</div>
		{/if}

		<div class="border-t border-white/10 pt-4">
			<p class="mb-2 text-xs font-medium tracking-wide text-zinc-500 uppercase">Details</p>
			<div
				class="prose prose-sm max-w-none text-zinc-300 prose-invert prose-headings:font-semibold prose-headings:text-zinc-100 prose-p:my-2 prose-strong:text-white"
			>
				<pre
					class="font-sans text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">{node.markdownContent}</pre>
			</div>
		</div>
	</div>
</div>
