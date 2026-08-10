<script lang="ts">
	import { resolve } from '$app/paths';
	import { getIsDark, toggleTheme } from '$lib/state/theme.svelte';
</script>

<nav
	class="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-6 sm:px-6"
	aria-label="Main"
>
	<a href={resolve('/')} class="text-sm font-medium text-zinc-900 dark:text-zinc-100"
		>Calvin Guillot</a
	>
	<div class="flex items-center gap-6">
		<a href={resolve('/about')} class="text-sm text-zinc-700 hover:underline dark:text-zinc-300"
			>About</a
		>
		<button
			type="button"
			class="text-sm text-zinc-700 hover:underline dark:text-zinc-300"
			onclick={toggleTheme}
			aria-label={getIsDark() ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{getIsDark() ? 'Light' : 'Dark'}
		</button>
	</div>
</nav>
