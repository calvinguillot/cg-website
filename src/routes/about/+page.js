import { definePageMetaTags } from 'svelte-meta-tags';
import { staticPageMetaTags } from '$lib/seo/site';
import aboutSource from '$lib/about/about.md?raw';

export function load() {
	const pageMetaTags = definePageMetaTags(
		staticPageMetaTags({
			title: 'About',
			description:
				'About Calvin Guillot — multidisciplinary artist, creative technologist, and engineer based in Helsinki.',
			path: '/about',
			image: '/pp.webp'
		})
	);

	return {
		source: aboutSource,
		...pageMetaTags
	};
}
