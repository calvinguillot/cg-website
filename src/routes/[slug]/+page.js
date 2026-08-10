import { error } from '@sveltejs/kit';
import { definePageMetaTags } from 'svelte-meta-tags';
import projects from '$lib/data/data.json';
import { getProjectByUrl } from '$lib/utils/projects';
import { SITE_NAME, buildCanonical, projectOgImage } from '$lib/seo/site';

const markdownFiles = import.meta.glob('$lib/projects/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

export function entries() {
	return projects.map((project) => ({ slug: project.url }));
}

export function load({ params }) {
	const { slug } = params;
	const project = getProjectByUrl(projects, slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	const fileKey = Object.keys(markdownFiles).find((key) => key.endsWith(`/${project.file}`));
	const source = fileKey ? markdownFiles[fileKey] : null;

	if (typeof source !== 'string') {
		throw error(404, 'Project content not found');
	}

	const canonical = buildCanonical(`/${project.url}`);
	const ogImage = projectOgImage(project.image);

	const pageMetaTags = definePageMetaTags({
		title: project.title,
		description: project.description,
		canonical,
		openGraph: {
			type: 'article',
			url: canonical,
			title: `${project.title} | ${SITE_NAME}`,
			description: project.description,
			images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }]
		}
	});

	return {
		project,
		source,
		...pageMetaTags
	};
}
