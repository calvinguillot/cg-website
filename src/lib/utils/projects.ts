export type Project = {
	title: string;
	year: string;
	url: string;
	location: string;
	description: string;
	file: string;
};

export type YearGroup = {
	year: string;
	label: string;
	projects: Project[];
};

function yearSortKey(year: string): number {
	const n = Number(year);
	return Number.isFinite(n) ? n : -Infinity;
}

/**
 * Group projects by year, newest first.
 */
export function groupProjectsByYear(projects: Project[]): YearGroup[] {
	const map = new Map<string, Project[]>();

	for (const project of projects) {
		const list = map.get(project.year) ?? [];
		list.push(project);
		map.set(project.year, list);
	}

	return [...map.entries()]
		.sort(([a], [b]) => yearSortKey(b) - yearSortKey(a))
		.map(([year, yearProjects]) => ({
			year,
			label: year,
			projects: yearProjects
		}));
}

export function getProjectByUrl(projects: Project[], slug: string): Project | undefined {
	return projects.find((p) => p.url === slug);
}
