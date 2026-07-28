<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import gsap from 'gsap';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const item = $derived(data.item);

	let cover = $state<HTMLDivElement | null>(null);
	let content = $state<HTMLDivElement | null>(null);

	onMount(() => {
		const tl = gsap.timeline();
		if (cover) {
			tl.to(cover, { yPercent: -100, duration: 0.7, ease: 'power3.inOut' });
		}
		if (content) {
			const targets = content.querySelectorAll('[data-reveal]');
			tl.from(
				targets,
				{ y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
				'-=0.35'
			);
		}
	});
</script>

<svelte:head>
	<title>{item.title} — Calvin Guillot</title>
	<meta name="description" content={item.description} />
</svelte:head>

<div
	bind:this={cover}
	class="fixed inset-0 z-50"
	style="background:{item.color};"
	aria-hidden="true"
></div>

<main class="min-h-dvh bg-[#06070c] text-zinc-100">
	<div
		class="relative h-[42vh] min-h-64 w-full overflow-hidden"
		style="background:{item.color};"
	>
		<div class="absolute inset-0 bg-linear-to-t from-[#06070c] via-transparent to-black/10"></div>
		<a
			href="{base}/"
			class="absolute top-5 left-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-sm text-white backdrop-blur-sm transition hover:bg-black/40 md:top-8 md:left-8"
		>
			<span aria-hidden="true">←</span> Back to gallery
		</a>
	</div>

	<div bind:this={content} class="mx-auto -mt-24 max-w-3xl px-5 pb-24 md:px-8">
		<p data-reveal class="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase">
			{item.type} · {item.yearBucket}
		</p>
		<h1 data-reveal class="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
			{item.title}
		</h1>
		<p data-reveal class="mt-3 text-sm text-zinc-400">{item.location}</p>
		{#if item.medium}
			<p data-reveal class="text-sm text-zinc-500">{item.medium}</p>
		{/if}

		<p data-reveal class="mt-8 text-base leading-relaxed text-zinc-200 md:text-lg">
			{item.description}
		</p>

		{#if item.technologies?.length}
			<div data-reveal class="mt-8">
				<p class="mb-3 text-xs font-medium tracking-wide text-zinc-500 uppercase">Technologies</p>
				<div class="flex flex-wrap gap-2">
					{#each item.technologies as tech (tech)}
						<span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-200">
							{tech}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		{#if item.collaborators?.length}
			<div data-reveal class="mt-6">
				<p class="mb-1 text-xs font-medium tracking-wide text-zinc-500 uppercase">Collaborators</p>
				<p class="text-sm text-zinc-300">{item.collaborators.join(', ')}</p>
			</div>
		{/if}

		<div data-reveal class="mt-10 border-t border-white/10 pt-8">
			<pre class="font-sans text-sm leading-relaxed whitespace-pre-wrap text-zinc-300">{item.markdownContent}</pre>
		</div>
	</div>
</main>
