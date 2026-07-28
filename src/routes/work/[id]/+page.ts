import { error } from '@sveltejs/kit';
import { getGalleryItem, galleryIds } from '$lib/data/gallery';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => {
	return galleryIds.map((id) => ({ id }));
};

export const load: PageLoad = ({ params }) => {
	const item = getGalleryItem(params.id);
	if (!item) {
		throw error(404, 'Project not found');
	}
	return { item };
};
