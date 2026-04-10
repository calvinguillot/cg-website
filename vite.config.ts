import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		dedupe: ['three'],
		alias: {
			three: path.resolve('./node_modules/three')
		}
	},
	ssr: {
		noExternal: ['threlte-postprocessing']
	}
});
