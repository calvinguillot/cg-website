<script lang="ts">
	import type { GalleryItem } from '$lib/data/gallery';

	let { items }: { items: GalleryItem[] } = $props();

	let hovered = $state<GalleryItem | null>(null);
</script>

<div class="fixed inset-0 touch-none overflow-hidden bg-black select-none">
	<div class="absolute inset-0 cursor-grab active:cursor-grabbing">
		{#each items as item (item.id)}
			<div
				class="absolute flex aspect-square w-48 items-center justify-center rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black"
				style="background-color: {item.color};"
				onmouseenter={() => (hovered = item)}
				onmouseleave={() => (hovered = null)}
				role="button"
				tabindex="0"
			>
				<span class="font-medium text-white drop-shadow-md">{item.title}</span>
			</div>
		{/each}
	</div>

	<div
		class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4 md:bottom-10"
	>
		{#if hovered}
			<div
				class="rounded-full border border-white/10 bg-black/50 px-5 py-2 text-center backdrop-blur-md"
			>
				<span class="text-sm font-medium text-white md:text-base">{hovered.title}</span>
				<span class="ml-2 text-xs text-zinc-400 uppercase">{hovered.type} · {hovered.year}</span>
			</div>
		{:else}
			<p class="animate-pulse text-xs tracking-[0.3em] text-white/35 uppercase">
				drag to explore · tap a card
			</p>
		{/if}
	</div>
</div>
