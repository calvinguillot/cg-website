<script lang="ts">
	import SphereGallery from '$lib/components/gallery/SphereGallery.svelte';
	import { galleryItems } from '$lib/data/gallery';
</script>

<svelte:head>
	<title>Calvin Guillot — Selected Work</title>
	<meta
		name="description"
		content="An interactive spherical gallery of Calvin Guillot's work across art, software, research and teaching."
	/>
</svelte:head>

<main class="relative h-dvh w-screen overflow-hidden bg-[#06070c]">
	<SphereGallery items={galleryItems} />

	<header class="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 md:p-8">
		<div>
			<p class="text-sm font-semibold tracking-tight text-white md:text-base">Calvin Guillot</p>
			<p class="text-xs tracking-wide text-zinc-400 uppercase">Selected Work</p>
		</div>
		<p class="hidden text-right text-xs tracking-wide text-zinc-400 uppercase sm:block">
			{galleryItems.length} projects
		</p>
	</header>
</main>
