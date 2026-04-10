---
name: sveltekit-architecture
description: >
  Use when creating new routes, pages, layouts, components, or reorganizing
  a SvelteKit application. Handles route structure, component hierarchy,
  state management with runes, static site patterns, and project organization.
  Do NOT use for styling, visual design, or 3D/WebGL work.
---

# SvelteKit Architecture

## Critical Rules

- This project uses **Svelte 5 runes mode** exclusively (enforced in `svelte.config.js`)
- Adapter is `adapter-static` — all routes must be prerenderable
- Always use the Svelte MCP `svelte-autofixer` tool after writing any `.svelte` file
- Always consult the `svelte-core-bestpractices` skill for rune patterns

## Workflow: Creating a New Route

1. **Determine the URL path** and confirm with the user
2. **Check for route conflicts:**
   ```bash
   ls src/routes/
   ```
3. **Create the route directory** matching the URL path:
   - `/about` → `src/routes/about/+page.svelte`
   - `/projects/[slug]` → `src/routes/projects/[slug]/+page.svelte`
4. **Decide if data loading is needed:**
   - Static content only → no `+page.js` needed
   - Needs data at build time → create `+page.js` with `export const prerender = true`
   - Dynamic params → create `+page.js` with `entries()` function for static adapter
5. **Add prerender export** if not inherited from parent layout:
   ```js
   // +page.js or +layout.js
   export const prerender = true;
   ```
6. **Verify:** run `npm run check` to confirm no type errors

## Workflow: Creating a Component

1. **Choose the correct location:**
   - Reusable across pages → `src/lib/components/`
   - Route-specific → co-locate in the route directory
   - UI primitives (Button, Card, etc.) → `src/lib/components/ui/`
2. **Name the file** in PascalCase: `ComponentName.svelte`
3. **Structure the component** using this order:
   ```svelte
   <script lang="ts">
     // 1. Imports
     // 2. Props via $props()
     // 3. Local state via $state()
     // 4. Derived values via $derived()
     // 5. Effects (only if absolutely necessary)
     // 6. Functions/handlers
   </script>

   <!-- Template -->

   <style>
     /* Scoped styles (prefer TailwindCSS classes in template) */
   </style>
   ```
4. **Define props** with TypeScript interface:
   ```ts
   interface Props {
     title: string;
     variant?: 'primary' | 'secondary';
     children: import('svelte').Snippet;
   }
   let { title, variant = 'primary', children }: Props = $props();
   ```
5. **Run the Svelte autofixer** on the file before finalizing

## Workflow: Managing Shared State

1. **Determine scope:**
   - Component tree only → use Svelte context with `createContext`
   - Across unrelated components → use a shared `.svelte.ts` module
   - Server-safe (SSR-compatible) → prefer context over modules
2. **For context-based state:**
   ```ts
   // src/lib/state/theme.svelte.ts
   import { createContext } from 'svelte';

   export const [getTheme, setTheme] = createContext<{ dark: boolean }>();
   ```
3. **For module-based state** (client-only singletons):
   ```ts
   // src/lib/state/navigation.svelte.ts
   let isOpen = $state(false);

   export function toggleNav() { isOpen = !isOpen; }
   export function getNavState() { return isOpen; }
   ```
4. **Never** use Svelte stores (`writable`, `readable`) — use `$state` runes instead

## Project Directory Structure

```
src/
├── app.html                    # HTML shell
├── app.d.ts                    # Global type declarations
├── lib/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Primitives: Button, Card, Modal...
│   │   ├── layout/             # Header, Footer, Nav, Section...
│   │   └── three/              # 3D/Threlte components
│   ├── state/                  # Shared state modules (.svelte.ts)
│   ├── utils/                  # Pure utility functions
│   ├── types/                  # Shared TypeScript types
│   └── assets/                 # Static assets imported in code
├── routes/
│   ├── +layout.svelte          # Root layout
│   ├── +layout.js              # Root prerender config
│   ├── +page.svelte            # Home page
│   ├── about/                  # /about
│   ├── projects/               # /projects and /projects/[slug]
│   └── ...
└── static/                     # Files served as-is (robots.txt, etc.)
```

## Static Site Patterns

- The root `+layout.js` should export `prerender = true` for the whole site
- For dynamic routes (`[slug]`), provide `entries()`:
  ```js
  export function entries() {
    return [{ slug: 'project-a' }, { slug: 'project-b' }];
  }
  ```
- Use `import.meta.env.BASE_URL` for base path references when deploying to a subpath
- Images in `src/lib/assets/` are processed by Vite (hashed, optimized)
- Images in `static/` are served as-is (use for large files, og-images)

## Verification Checklist

After any structural change:

1. `npm run check` — TypeScript and Svelte validation pass
2. `npm run build` — static build succeeds with no prerender errors
3. `npm run lint` — no linter or formatting issues

## Additional Resources

- For component patterns and rune best practices, see the `svelte-core-bestpractices` skill (REQUIRED)
- For route and data loading details, see [references/data-loading.md](references/data-loading.md)
