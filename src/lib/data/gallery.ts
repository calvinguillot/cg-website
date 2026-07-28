import graph from './cv-graph.json';
import type { CvGraphData, CvGraphNode } from '$lib/types/cv-graph';

const data = graph as CvGraphData;

/** Solid colours keyed by node type — stand-ins for real imagery for now. */
export const TYPE_COLORS: Record<string, string> = {
	education: '#4f7cff',
	work: '#ff5d73',
	art: '#c084fc',
	talk: '#34d399',
	software: '#fbbf24'
};

export const FALLBACK_COLOR = '#9ca3af';

export type GalleryItem = {
	id: string;
	title: string;
	type: string;
	year: number;
	yearBucket: string;
	category: string;
	description: string;
	technologies: string[];
	location: string;
	medium: string | null;
	collaborators: string[];
	markdownContent: string;
	color: string;
};

function toItem(node: CvGraphNode): GalleryItem {
	return {
		id: node.id,
		title: node.title,
		type: node.type,
		year: node.year,
		yearBucket: node.yearBucket,
		category: node.category,
		description: node.description,
		technologies: node.technologies,
		location: node.location,
		medium: node.medium,
		collaborators: node.collaborators,
		markdownContent: node.markdownContent,
		color: TYPE_COLORS[node.type] ?? FALLBACK_COLOR
	};
}

export const galleryItems: GalleryItem[] = data.nodes
	.map(toItem)
	.sort((a, b) => b.year - a.year);

export function getGalleryItem(id: string): GalleryItem | undefined {
	return galleryItems.find((item) => item.id === id);
}

export const galleryIds: string[] = galleryItems.map((item) => item.id);
