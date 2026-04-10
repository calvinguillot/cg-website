<script lang="ts">
	import type { ClusterModeId } from '$lib/types/cv-graph';

	let {
		value = $bindable<ClusterModeId>('category'),
		options
	}: {
		value?: ClusterModeId;
		options: { id: ClusterModeId; label: string }[];
	} = $props();
</script>

<div
	class="pointer-events-auto fixed top-4 left-4 z-20 rounded-xl border border-white/10 bg-black/40 px-3 py-2 shadow-lg backdrop-blur-md md:top-6 md:left-6"
>
	<label class="mb-1 block text-xs font-medium tracking-wide text-zinc-400 uppercase" for="cluster-mode">
		Clustering
	</label>
	<select
		id="cluster-mode"
		class="w-[min(100vw-3rem,16rem)] cursor-pointer rounded-lg border border-white/15 bg-black/50 px-3 py-2 text-sm text-zinc-100 outline-none focus:ring-2 focus:ring-cyan-400/40"
		bind:value
	>
		{#each options as opt (opt.id)}
			<option value={opt.id}>{opt.label}</option>
		{/each}
	</select>
</div>
