# Responsive Layout Patterns

## Hero Section

Full-viewport hero with centered content:

```svelte
<section class="flex min-h-svh items-center justify-center px-4">
	<div class="max-w-3xl text-center">
		<h1 class="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Title</h1>
		<p class="mt-6 text-lg text-white/70 sm:text-xl">Subtitle text here</p>
	</div>
</section>
```

## Split Layout

Text and media side by side (stacks on mobile):

```svelte
<section class="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
	<div class="space-y-4">
		<h2 class="text-3xl font-bold">Heading</h2>
		<p class="text-white/70">Description</p>
	</div>
	<div class="aspect-video overflow-hidden rounded-xl">
		<!-- Media content -->
	</div>
</section>
```

## Masonry-Style Grid

For portfolio/project cards with varying heights:

```svelte
<div class="columns-1 gap-4 sm:columns-2 lg:columns-3">
	{#each items as item (item.id)}
		<div class="mb-4 break-inside-avoid">
			<Card {item} />
		</div>
	{/each}
</div>
```

## Sticky Sidebar

For project detail pages:

```svelte
<div class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
	<main>
		<!-- Scrollable content -->
	</main>
	<aside class="lg:sticky lg:top-8 lg:self-start">
		<!-- Sticky sidebar -->
	</aside>
</div>
```

## Full-Bleed Section Inside Container

Break out of the container for a full-width background:

```svelte
<section class="relative -mx-4 bg-white/5 px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
	<div class="mx-auto max-w-7xl">
		<!-- Content within max-width -->
	</div>
</section>
```

## Navigation

Responsive nav with mobile hamburger pattern:

```svelte
<nav class="flex items-center justify-between py-4">
	<a href="/" class="text-xl font-bold">Logo</a>

	<!-- Desktop nav -->
	<div class="hidden gap-6 md:flex">
		{#each links as link}
			<a href={link.href} class="text-white/70 transition-colors hover:text-white">
				{link.label}
			</a>
		{/each}
	</div>

	<!-- Mobile toggle -->
	<button class="md:hidden" aria-label="Toggle menu" onclick={toggleMenu}>
		<MenuIcon />
	</button>
</nav>
```
