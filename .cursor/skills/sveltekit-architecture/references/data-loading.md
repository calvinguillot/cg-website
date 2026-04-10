# Data Loading Patterns for Static Sites

## +page.js vs +page.server.js

For `adapter-static`, use `+page.js` (not `+page.server.js`) unless you need
secrets or server-only APIs at build time.

## Loading Data at Build Time

```js
// src/routes/projects/+page.js
export const prerender = true;

export async function load() {
  // This runs at build time with adapter-static
  const projects = await fetchProjectData();
  return { projects };
}
```

## Dynamic Route Entries

For parameterized routes, provide all possible values:

```js
// src/routes/projects/[slug]/+page.js
export const prerender = true;

export function entries() {
  return [
    { slug: 'sonorama' },
    { slug: 'carlosverse' },
    { slug: 'kraftlaus' }
  ];
}

export async function load({ params }) {
  const project = getProjectBySlug(params.slug);
  return { project };
}
```

## Importing Static Data

For content that lives in the repo, import directly:

```js
// src/lib/data/projects.ts
export const projects = [
  { slug: 'sonorama', title: 'Sonorama', year: 2023, ... },
  // ...
];
```

Then in `+page.js`:

```js
import { projects } from '$lib/data/projects';

export function load() {
  return { projects };
}
```

## Error Handling

Always handle missing data gracefully:

```js
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const project = getProjectBySlug(params.slug);
  if (!project) throw error(404, 'Project not found');
  return { project };
}
```
