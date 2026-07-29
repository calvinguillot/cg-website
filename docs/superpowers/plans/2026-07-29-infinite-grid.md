# Infinite Grid Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3D spherical gallery with a 2D infinite draggable grid using GSAP Observer and standard DOM elements.

**Architecture:** We will extract the nodes from the existing graph JSON into a flat array. The `InfiniteGallery.svelte` component will render these nodes as absolutely positioned square divs. GSAP `Observer` will track drag events to update a global offset, and GSAP `utils.wrap` will handle the infinite wrapping of elements across the screen.

**Tech Stack:** Svelte 5, TailwindCSS v4, GSAP (Core, Observer)

## Global Constraints

- Use TailwindCSS v4 utility classes.
- Use Svelte 5 runes (`$state`, `$props`, `$effect`).
- Ensure GSAP animations are cleaned up on component destroy (using Svelte 5 `$effect` cleanup or `onMount` return).

---

### Task 1: Data Source Migration

**Files:**
- Create: `src/lib/data/data.json`
- Modify: `src/lib/data/gallery.ts`
- Modify: `package.json` (optional, to remove `data:cv-graph` script if no longer needed, but let's just focus on the files for now)

**Interfaces:**
- Consumes: `src/lib/data/cv-graph.json`
- Produces: `src/lib/data/data.json` (Array of nodes), updated `galleryItems` array.

- [ ] **Step 1: Create `data.json` script/manual extraction**
Since we are an agent, we can write a script to extract it or just do it inline. Let's write a quick node script to extract it.

Create `scripts/extract-data.mjs`:
```javascript
import fs from 'fs';
import path from 'path';

const graph = JSON.parse(fs.readFileSync(path.resolve('src/lib/data/cv-graph.json'), 'utf-8'));
const nodes = graph.nodes.map(node => {
  const { positions, ...rest } = node;
  return rest;
});

fs.writeFileSync(path.resolve('src/lib/data/data.json'), JSON.stringify(nodes, null, 2));
```

- [ ] **Step 2: Run the extraction script**
Run: `node scripts/extract-data.mjs`
Expected: `src/lib/data/data.json` is created with the nodes array.

- [ ] **Step 3: Update `src/lib/data/gallery.ts`**
Modify `src/lib/data/gallery.ts` to import `data.json` instead of `cv-graph.json`.

```typescript
import data from './data.json';

// ... TYPE_COLORS and FALLBACK_COLOR remain the same ...

export type GalleryItem = {
	id: string;
	title: string;
	type: string;
	year: number;
	yearBucket: string;
	category: string;
	description: string;
	technologies: string[];
	location: string;
	medium: string | null;
	collaborators: string[];
	markdownContent: string;
	color: string;
};

function toItem(node: any): GalleryItem {
	return {
		id: node.id,
		title: node.title,
		type: node.type,
		year: node.year,
		yearBucket: node.yearBucket,
		category: node.category,
		description: node.description,
		technologies: node.technologies,
		location: node.location,
		medium: node.medium,
		collaborators: node.collaborators,
		markdownContent: node.markdownContent,
		color: TYPE_COLORS[node.type] ?? FALLBACK_COLOR
	};
}

export const galleryItems: GalleryItem[] = (data as any[])
	.map(toItem)
	.sort((a, b) => b.year - a.year);

export function getGalleryItem(id: string): GalleryItem | undefined {
	return galleryItems.find((item) => item.id === id);
}

export const galleryIds: string[] = galleryItems.map((item) => item.id);
```

- [ ] **Step 4: Verify types and check**
Run: `npm run check`
Expected: PASS (no type errors related to `gallery.ts`).

- [ ] **Step 5: Commit**
```bash
git add scripts/extract-data.mjs src/lib/data/data.json src/lib/data/gallery.ts
git commit -m "refactor: migrate gallery data source to flat json array"
```

---

### Task 2: InfiniteGallery Component Layout

**Files:**
- Create: `src/lib/components/gallery/InfiniteGallery.svelte`

**Interfaces:**
- Consumes: `items` prop (`GalleryItem[]`)
- Produces: A rendering of square divs.

- [ ] **Step 1: Create `InfiniteGallery.svelte` skeleton**

```svelte
<script lang="ts">
	import type { GalleryItem } from '$lib/data/gallery';

	let { items }: { items: GalleryItem[] } = $props();
	
	let hovered = $state<GalleryItem | null>(null);
</script>

<div class="fixed inset-0 touch-none select-none overflow-hidden bg-black">
	<div class="absolute inset-0 cursor-grab active:cursor-grabbing">
		{#each items as item (item.id)}
			<div 
				class="absolute flex aspect-square w-48 items-center justify-center rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black"
				style="background-color: {item.color};"
				onmouseenter={() => hovered = item}
				onmouseleave={() => hovered = null}
				role="button"
				tabindex="0"
			>
				<span class="font-medium text-white drop-shadow-md">{item.title}</span>
			</div>
		{/each}
	</div>

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
</div>
```

- [ ] **Step 2: Check formatting**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/lib/components/gallery/InfiniteGallery.svelte
git commit -m "feat: create basic layout for infinite gallery"
```

---

### Task 3: GSAP Observer & Infinite Wrapping

**Files:**
- Modify: `src/lib/components/gallery/InfiniteGallery.svelte`

**Interfaces:**
- Consumes: GSAP `Observer` plugin.
- Produces: Interactive dragging and wrapping logic.

- [ ] **Step 1: Add GSAP logic to `InfiniteGallery.svelte`**

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Observer from 'gsap/Observer';
	import type { GalleryItem } from '$lib/data/gallery';

	let { items }: { items: GalleryItem[] } = $props();
	
	let hovered = $state<GalleryItem | null>(null);
	let container: HTMLDivElement;
	let cards: HTMLDivElement[] = [];

	onMount(() => {
		gsap.registerPlugin(Observer);

		const cols = 6;
		const rows = Math.ceil(items.length / cols);
		const cardSize = 250; // width + gap
		const gridWidth = cols * cardSize;
		const gridHeight = rows * cardSize;

		// Initial positioning
		cards.forEach((card, i) => {
			if (!card) return;
			const col = i % cols;
			const row = Math.floor(i / cols);
			gsap.set(card, {
				x: col * cardSize - gridWidth / 2 + window.innerWidth / 2,
				y: row * cardSize - gridHeight / 2 + window.innerHeight / 2
			});
		});

		const wrapX = gsap.utils.wrap(-cardSize, gridWidth - cardSize);
		const wrapY = gsap.utils.wrap(-cardSize, gridHeight - cardSize);

		let scrollX = 0;
		let scrollY = 0;

		const ctx = gsap.context(() => {
			Observer.create({
				target: container,
				type: "pointer,touch,wheel",
				onChange: (self) => {
					scrollX += self.deltaX;
					scrollY += self.deltaY;
					
					cards.forEach((card, i) => {
						if (!card) return;
						const col = i % cols;
						const row = Math.floor(i / cols);
						
						// Calculate raw position including scroll
						const rawX = (col * cardSize) + scrollX;
						const rawY = (row * cardSize) + scrollY;
						
						// Apply wrapping relative to the grid size
						gsap.set(card, {
							x: wrapX(rawX) - gridWidth / 2 + window.innerWidth / 2,
							y: wrapY(rawY) - gridHeight / 2 + window.innerHeight / 2
						});
					});
				}
			});
		}, container);

		// Trigger initial layout
		Observer.getById("observer")?.onChange({ deltaX: 0, deltaY: 0 } as any);

		return () => ctx.revert();
	});
</script>

<div class="fixed inset-0 touch-none select-none overflow-hidden bg-black" bind:this={container}>
	<div class="absolute inset-0 cursor-grab active:cursor-grabbing">
		{#each items as item, i (item.id)}
			<div 
				bind:this={cards[i]}
				class="absolute flex aspect-square w-48 items-center justify-center rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black"
				style="background-color: {item.color};"
				onmouseenter={() => hovered = item}
				onmouseleave={() => hovered = null}
				role="button"
				tabindex="0"
			>
				<span class="font-medium text-white drop-shadow-md pointer-events-none">{item.title}</span>
			</div>
		{/each}
	</div>
	<!-- ... bottom bar ... -->
```
*(Note: The wrapper logic needs to be robust. We use `gsap.utils.wrap` to keep items within the grid bounds. The exact math might need a slight tweak during implementation, but this provides the correct structure.)*

- [ ] **Step 2: Check formatting**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/lib/components/gallery/InfiniteGallery.svelte
git commit -m "feat: add gsap observer and infinite wrapping logic"
```

---

### Task 4: Click Transitions and Entry Animation

**Files:**
- Modify: `src/lib/components/gallery/InfiniteGallery.svelte`

**Interfaces:**
- Consumes: Navigation (`goto`).
- Produces: Smooth page transitions.

- [ ] **Step 1: Add transition logic to `InfiniteGallery.svelte`**

```svelte
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
		
		// Get click coordinates or center of screen for keyboard
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
		// ... existing grid setup ...
		
		const ctx = gsap.context(() => {
			// Entry animation
			gsap.from(cards, {
				scale: 0,
				opacity: 0,
				duration: 0.8,
				stagger: 0.02,
				ease: "back.out(1.7)"
			});

			// ... existing Observer logic ...
		}, container);

		return () => ctx.revert();
	});
</script>

<!-- Add click handlers to cards -->
<div 
	bind:this={cards[i]}
	class="absolute flex aspect-square w-48 items-center justify-center rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 hover:ring-2 hover:ring-white/50 hover:ring-offset-2 hover:ring-offset-black"
	style="background-color: {item.color};"
	onmouseenter={() => hovered = item}
	onmouseleave={() => hovered = null}
	onclick={(e) => handleSelect(item, e)}
	onkeydown={(e) => e.key === 'Enter' && handleSelect(item, e)}
	role="button"
	tabindex="0"
>
<!-- ... -->

<!-- Add bubble overlay at the bottom -->
{#if transitioning}
	<div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
		<span
			bind:this={bubble}
			class="absolute block -translate-x-1/2 -translate-y-1/2 rounded-full"
			style={bubbleStyle}
		></span>
	</div>
{/if}
```

- [ ] **Step 2: Check formatting**
Run: `npm run lint`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/lib/components/gallery/InfiniteGallery.svelte
git commit -m "feat: add entry animations and click transitions"
```

---

### Task 5: Integration

**Files:**
- Modify: `src/routes/+page.svelte`

**Interfaces:**
- Consumes: `InfiniteGallery.svelte`
- Produces: The updated homepage.

- [ ] **Step 1: Replace SphereGallery with InfiniteGallery**

```svelte
<script lang="ts">
	import InfiniteGallery from '$lib/components/gallery/InfiniteGallery.svelte';
	import { galleryItems } from '$lib/data/gallery';
</script>

<svelte:head>
	<title>Calvin Guillot</title>
</svelte:head>

<main class="h-screen w-screen overflow-hidden bg-black">
	<InfiniteGallery items={galleryItems} />
</main>
```

- [ ] **Step 2: Run tests / check**
Run: `npm run check`
Expected: PASS

- [ ] **Step 3: Commit**
```bash
git add src/routes/+page.svelte
git commit -m "feat: integrate infinite gallery into homepage"
```
