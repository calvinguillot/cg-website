<script lang="ts">
	import { resolve } from '$app/paths';

	let { data } = $props();

	const groups = $derived(data.groups ?? []);
</script>

<div class="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
	<div class="flex flex-col gap-12">
		{#each groups as group (group.year)}
			<section class="flex gap-6 sm:gap-10" aria-labelledby="year-{group.year}">
				<h2
					id="year-{group.year}"
					class="shrink-0 self-start text-sm leading-none font-normal tracking-wide text-zinc-500 dark:text-zinc-400"
					style="writing-mode: sideways-lr;"
				>
					{group.label}
				</h2>
				<ul class="flex flex-col gap-2">
					{#each group.projects as project (project.url)}
						<li>
							<a
								href={resolve('/[slug]', { slug: project.url })}
								class="text-base text-zinc-900 hover:underline sm:text-lg dark:text-zinc-100"
							>
								{project.title}
							</a>
						</li>
					{/each}
				</ul>
			</section>
		{/each}
	</div>
</div>
