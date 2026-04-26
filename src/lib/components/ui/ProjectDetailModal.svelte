<script lang="ts">
	import type { CvGraphNode } from '$lib/types/cv-graph';

	interface Props {
		node: CvGraphNode | null;
		onclose: () => void;
	}

	let { node, onclose }: Props = $props();

	let metadata = $derived.by(() => {
		if (!node) return [];

		return [
			['Type', node.type],
			['Category', node.category],
			['Year', String(node.year)],
			['Location', node.location],
			['Medium', node.medium],
			['Technology family', node.techCluster.replaceAll('_', ' ')]
		].filter((item): item is [string, string] => Boolean(item[1]));
	});

	$effect(() => {
		if (!node) return;

		const previousBodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = previousBodyOverflow;
		};
	});

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && node) {
			onclose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if node}
	<div
		class="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 backdrop-blur-sm sm:items-center"
	>
		<button
			type="button"
			class="absolute inset-0 cursor-default"
			tabindex="-1"
			aria-label="Close project details"
			onclick={onclose}
		></button>
		<div
			class="relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/15 bg-zinc-950/95 p-6 text-white shadow-2xl shadow-black/60 outline-none sm:p-8"
			role="dialog"
			aria-modal="true"
			aria-labelledby="project-detail-title"
		>
			<div class="flex items-start justify-between gap-4">
				<div class="space-y-2">
					<p class="text-sm font-medium tracking-[0.28em] text-cyan-200/80 uppercase">
						{node.yearBucket}
					</p>
					<h2
						id="project-detail-title"
						class="text-2xl font-semibold tracking-tight text-white sm:text-3xl"
					>
						{node.title}
					</h2>
				</div>
				<!-- svelte-ignore a11y_autofocus -->
				<button
					type="button"
					class="rounded-full border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:outline-none"
					aria-label="Close project details"
					autofocus
					onclick={onclose}
				>
					Close
				</button>
			</div>

			<p class="mt-6 text-base leading-7 text-white/80">{node.description}</p>

			<dl class="mt-6 grid gap-4 sm:grid-cols-2">
				{#each metadata as [label, value] (label)}
					<div class="rounded-2xl border border-white/10 bg-white/3 p-4">
						<dt class="text-xs font-medium tracking-[0.22em] text-white/45 uppercase">{label}</dt>
						<dd class="mt-2 text-sm text-white/85 capitalize">{value}</dd>
					</div>
				{/each}
			</dl>

			{#if node.technologies.length}
				<section class="mt-6" aria-labelledby="project-tech-title">
					<h3
						id="project-tech-title"
						class="text-sm font-semibold tracking-[0.22em] text-white/55 uppercase"
					>
						Technologies
					</h3>
					<ul class="mt-3 flex flex-wrap gap-2">
						{#each node.technologies as technology (technology)}
							<li class="rounded-full bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
								{technology}
							</li>
						{/each}
					</ul>
				</section>
			{/if}

			{#if node.collaborators.length}
				<section class="mt-6" aria-labelledby="project-collaborators-title">
					<h3
						id="project-collaborators-title"
						class="text-sm font-semibold tracking-[0.22em] text-white/55 uppercase"
					>
						Collaborators
					</h3>
					<ul class="mt-3 list-inside list-disc space-y-1 text-sm text-white/75">
						{#each node.collaborators as collaborator (collaborator)}
							<li>{collaborator}</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>
	</div>
{/if}
