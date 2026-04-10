<script lang="ts">
	import { Canvas } from '@threlte/core';
	import GraphScene from '$lib/components/scene/GraphScene.svelte';
	import ClusterDropdown from '$lib/components/ui/ClusterDropdown.svelte';
	import ProjectModal from '$lib/components/ui/ProjectModal.svelte';
	import graphJson from '$lib/data/cv-graph.json';
	import type { ClusterModeId, CvGraphData, CvGraphNode } from '$lib/types/cv-graph';

	const graph = graphJson as CvGraphData;

	let clusterMode = $state<ClusterModeId>('category');
	let selectedNode = $state<CvGraphNode | null>(null);
</script>

<svelte:head>
	<title>Calvin Guillot — CV graph</title>
	<meta name="description" content="3D portfolio graph — projects, work, and education" />
</svelte:head>

<div class="relative h-dvh w-full overflow-hidden bg-black">
	<div class="absolute inset-0 z-0">
		<Canvas>
			<GraphScene {graph} {clusterMode} bind:selectedNode />
		</Canvas>
	</div>

	<div class="pointer-events-none absolute inset-0 z-10">
		<ClusterDropdown bind:value={clusterMode} options={graph.clusterModes} />

		{#if selectedNode}
			<ProjectModal node={selectedNode} onclose={() => (selectedNode = null)} />
		{/if}
	</div>
</div>
