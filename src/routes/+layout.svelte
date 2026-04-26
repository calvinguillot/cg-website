<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href="/calvin_surf.ico" /></svelte:head>
<div class="min-h-dvh bg-black text-zinc-100 antialiased">
	{@render children()}
</div>
