<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import gsap from 'gsap';
	import Observer from 'gsap/Observer';
	import type { GalleryItem } from '$lib/data/gallery';

	let { items }: { items: GalleryItem[] } = $props();

	let hovered = $state<GalleryItem | null>(null);
	let transitioning = $state(false);
	let bubbleStyle = $state('');
	let bubble = $state<HTMLSpanElement | null>(null);
	let container: HTMLDivElement;
	let cards: HTMLDivElement[] = [];

	function handleSelect(item: GalleryItem, event: MouseEvent | KeyboardEvent) {
		if (transitioning) return;
		transitioning = true;

		let x = window.innerWidth / 2;
		let y = window.innerHeight / 2;

		if (event instanceof MouseEvent) {
			x = event.clientX;
			y = event.clientY;
		}

		const diag = Math.hypot(window.innerWidth, window.innerHeight);
		const dim = diag * 2;
		bubbleStyle = `left:${x}px;top:${y}px;width:${dim}px;height:${dim}px;background:${item.color};`;

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
		gsap.registerPlugin(Observer);

		const cols = 6;
		const rows = Math.ceil(items.length / cols);
		const cardSize = 250; // width + gap
		const gridWidth = cols * cardSize;
		const gridHeight = rows * cardSize;

		const wrapX = gsap.utils.wrap(-cardSize, gridWidth - cardSize);
		const wrapY = gsap.utils.wrap(-cardSize, gridHeight - cardSize);

		let scrollX = 0;
		let scrollY = 0;

		const updateCards = (deltaX = 0, deltaY = 0) => {
			scrollX += deltaX;
			scrollY += deltaY;

			cards.forEach((card, i) => {
				if (!card) return;
				const col = i % cols;
				const row = Math.floor(i / cols);

				const rawX = col * cardSize + scrollX;
				const rawY = row * cardSize + scrollY;

				gsap.set(card, {
					x: wrapX(rawX) - gridWidth / 2 + window.innerWidth / 2,
					y: wrapY(rawY) - gridHeight / 2 + window.innerHeight / 2
				});
			});
		};

		const ctx = gsap.context(() => {
			gsap.from(cards, {
				scale: 0,
				opacity: 0,
				duration: 0.8,
				stagger: 0.02,
				ease: 'back.out(1.7)'
			});

			Observer.create({
				target: container,
				type: 'pointer,touch,wheel',
				onChange: (self) => updateCards(self.deltaX, self.deltaY)
			});
		}, container);

		updateCards();

		return () => ctx.revert();
	});
</script>

<div class="fixed inset-0 touch-none overflow-hidden bg-black select-none" bind:this={container}>
	<div class="absolute inset-0 cursor-grab active:cursor-grabbing">
		{#each items as item, i (item.id)}
			<div
				bind:this={cards[i]}
				class="absolute flex aspect-square w-48 items-center justify-center rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black"
				style="background-color: {item.color};"
				onmouseenter={() => (hovered = item)}
				onmouseleave={() => (hovered = null)}
				onclick={(e) => handleSelect(item, e)}
				onkeydown={(e) => e.key === 'Enter' && handleSelect(item, e)}
				role="button"
				tabindex="0"
			>
				<span class="pointer-events-none font-medium text-white drop-shadow-md">{item.title}</span>
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

{#if transitioning}
	<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
		<span
			bind:this={bubble}
			class="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full"
			style={bubbleStyle}
		></span>
	</div>
{/if}
