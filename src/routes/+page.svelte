<script lang="ts">
	import CvForceGraph from '$lib/components/graph/CvForceGraph.svelte';
	import ClusterModeSelect from '$lib/components/ui/ClusterModeSelect.svelte';
	import ProjectDetailModal from '$lib/components/ui/ProjectDetailModal.svelte';
	import cvGraphData from '$lib/data/cv-graph.json';
	import type { ClusterModeId, CvGraphData, CvGraphNode } from '$lib/types/cv-graph';

	const graph = cvGraphData as CvGraphData;

	let clusterMode: ClusterModeId = $state(graph.clusterModes[0]?.id ?? 'category');
	let selectedNode: CvGraphNode | null = $state(null);
</script>

<svelte:head>
	<title>Calvin Guillot | Portfolio</title>
	<meta
		name="description"
		content="Interactive portfolio graph for Calvin Guillot, organized by category, technology, and year."
	/>
</svelte:head>

<main
	class="relative h-dvh overflow-hidden bg-black text-white"
	aria-labelledby="portfolio-graph-title"
>
	<div
		class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_42%),linear-gradient(180deg,rgba(24,24,27,0.55),rgba(0,0,0,0.95))]"
	></div>

	<section
		class="relative z-10 flex h-full flex-col"
		aria-describedby="portfolio-graph-description"
	>
		<div
			class="pointer-events-none absolute top-0 right-0 left-0 z-20 flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-6"
		>
			<div
				class="max-w-xl rounded-3xl border border-white/10 bg-black/45 p-5 shadow-xl shadow-black/30 backdrop-blur"
			>
				<p class="text-sm font-medium tracking-[0.32em] text-cyan-200/75 uppercase">
					Portfolio Graph
				</p>
				<h1
					id="portfolio-graph-title"
					class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl"
				>
					Calvin Guillot
				</h1>
				<p
					id="portfolio-graph-description"
					class="mt-3 text-sm leading-6 text-white/65 sm:text-base"
				>
					Explore projects, work, and education as a force-directed canvas graph. Switching cluster
					mode reshapes the same full dataset.
				</p>
			</div>

			<div class="pointer-events-auto">
				<ClusterModeSelect
					modes={graph.clusterModes}
					value={clusterMode}
					onchange={(mode) => (clusterMode = mode)}
				/>
			</div>
		</div>

		<div class="min-h-0 flex-1">
			<CvForceGraph {graph} mode={clusterMode} onselect={(node) => (selectedNode = node)} />
		</div>
	</section>

	<ProjectDetailModal node={selectedNode} onclose={() => (selectedNode = null)} />
</main>
