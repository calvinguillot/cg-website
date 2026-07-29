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
