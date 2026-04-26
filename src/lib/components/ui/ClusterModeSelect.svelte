<script lang="ts">
	import type { ClusterModeId, CvGraphData } from '$lib/types/cv-graph';

	interface Props {
		modes: CvGraphData['clusterModes'];
		value: ClusterModeId;
		onchange: (mode: ClusterModeId) => void;
	}

	let { modes, value, onchange }: Props = $props();

	function handleChange(event: Event) {
		onchange((event.currentTarget as HTMLSelectElement).value as ClusterModeId);
	}
</script>

<label class="flex flex-col gap-2 text-sm font-medium text-white/90" for="cluster-mode">
	<span>Cluster mode</span>
	<select
		id="cluster-mode"
		class="rounded-full border border-white/15 bg-black/70 px-4 py-2 text-sm text-white shadow-lg shadow-black/30 backdrop-blur transition-colors outline-none hover:border-white/30 focus-visible:ring-2 focus-visible:ring-cyan-300"
		{value}
		onchange={handleChange}
	>
		{#each modes as mode (mode.id)}
			<option value={mode.id}>{mode.label}</option>
		{/each}
	</select>
</label>
