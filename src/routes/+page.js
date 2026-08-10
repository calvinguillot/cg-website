import { definePageMetaTags } from 'svelte-meta-tags';
import projects from '$lib/data/data.json';
import { groupProjectsByYear } from '$lib/utils/projects';
import { SITE_NAME, staticPageMetaTags } from '$lib/seo/site';

export function load() {
	const groups = groupProjectsByYear(projects);
	const pageMetaTags = definePageMetaTags(
		staticPageMetaTags({
			title: 'Portfolio',
			description:
				'Art portfolio of Calvin Guillot — new media artist and creative technologist based in Helsinki. Projects grouped by year.',
			path: '/'
		})
	);

	return {
		groups,
		siteName: SITE_NAME,
		...pageMetaTags
	};
}
