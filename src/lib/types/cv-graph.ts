export type ClusterModeId = 'category' | 'technology' | 'year';

export type CvGraphNode = {
	id: string;
	title: string;
	type: string;
	year: number;
	yearBucket: string;
	description: string;
	technologies: string[];
	location: string;
	medium: string | null;
	collaborators: string[];
	category: string;
	techCluster: string;
	markdownContent: string;
	positions: Record<ClusterModeId, [number, number, number]>;
};

export type CvGraphEdge = {
	source: string;
	target: string;
	sharedSkills: string[];
};

export type CvGraphData = {
	version: number;
	clusterModes: { id: ClusterModeId; label: string }[];
	nodes: CvGraphNode[];
	edges: CvGraphEdge[];
};
