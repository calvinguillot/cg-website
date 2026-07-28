<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import gsap from 'gsap';
	import { createSphereGallery, type SphereGalleryController, type ScreenPoint } from '$lib/gallery/sphereScene';
	import type { GalleryItem } from '$lib/data/gallery';

	let { items }: { items: GalleryItem[] } = $props();

	let canvas: HTMLCanvasElement;
	let bubble = $state<HTMLSpanElement | null>(null);
	let controller: SphereGalleryController | undefined;

	let hovered = $state<GalleryItem | null>(null);
	let transitioning = $state(false);
	let bubbleStyle = $state('');

	function handleSelect(item: GalleryItem, screen: ScreenPoint) {
		if (transitioning) return;
		transitioning = true;
		controller?.setInteractive(false);
		controller?.focus(item.id);

		const diag = Math.hypot(window.innerWidth, window.innerHeight);
		const dim = diag * 2;
		bubbleStyle = `left:${screen.x}px;top:${screen.y}px;width:${dim}px;height:${dim}px;background:${item.color};`;

		requestAnimationFrame(() => {
			if (!bubble) {
				goto(`${base}/work/${item.id}`);
				return;
			}
			gsap.fromTo(
				bubble,
				{ scale: 0, opacity: 1 },
				{
					scale: 1,
					duration: 0.7,
					ease: 'power3.inOut',
					onComplete: () => goto(`${base}/work/${item.id}`)
				}
			);
		});
	}

	onMount(() => {
		controller = createSphereGallery({
			canvas,
			items,
			onHoverChange: (item) => (hovered = item),
			onSelect: handleSelect
		});
		return () => controller?.dispose();
	});
</script>

<div class="fixed inset-0 touch-none select-none">
	<canvas bind:this={canvas} class="block h-full w-full cursor-grab active:cursor-grabbing"></canvas>

	{#if !transitioning}
		<div class="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-4 md:bottom-10">
			{#if hovered}
				<div class="rounded-full border border-white/10 bg-black/50 px-5 py-2 text-center backdrop-blur-md">
					<span class="text-sm font-medium text-white md:text-base">{hovered.title}</span>
					<span class="ml-2 text-xs text-zinc-400 uppercase">{hovered.type} · {hovered.year}</span>
				</div>
			{:else}
				<p class="animate-pulse text-xs tracking-[0.3em] text-white/35 uppercase">
					drag to explore · tap a card
				</p>
			{/if}
		</div>
	{/if}

	{#if transitioning}
		<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
			<span
				bind:this={bubble}
				class="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full"
				style={bubbleStyle}
			></span>
		</div>
	{/if}
</div>
