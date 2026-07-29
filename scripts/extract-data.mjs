import fs from 'fs';
import path from 'path';

const graph = JSON.parse(fs.readFileSync(path.resolve('src/lib/data/cv-graph.json'), 'utf-8'));
const nodes = graph.nodes.map((node) => {
	const { positions, ...rest } = node;
	return rest;
});

fs.writeFileSync(path.resolve('src/lib/data/data.json'), JSON.stringify(nodes, null, 2));
