---
name: ui-ux-design
description: >
  Use when designing user interfaces, creating page layouts, building responsive
  components, or improving visual design and accessibility in Svelte with
  TailwindCSS v4. Handles typography, spacing, color, motion, responsive layout,
  and WCAG accessibility. Do NOT use for 3D/WebGL scenes or backend logic.
---

# UI/UX Design

## Critical Rules

- Use **TailwindCSS v4** utility classes — no arbitrary CSS unless Tailwind cannot express it
- Mobile-first responsive design: start with base styles, layer up with `sm:`, `md:`, `lg:`
- All interactive elements must be keyboard-accessible and have visible focus states
- Color contrast must meet WCAG AA (4.5:1 for text, 3:1 for large text/UI elements)
- Prefer CSS custom properties via `style:` directive for dynamic values

## Workflow: Designing a New Page

1. **Define the content hierarchy** before writing any code:
   - What is the primary action/message?
   - What sections exist and in what order?
   - What is the visual weight of each section?
2. **Sketch the layout** using semantic HTML structure:
   ```svelte
   <main>
   	<section aria-labelledby="hero-heading">...</section>
   	<section aria-labelledby="projects-heading">...</section>
   	<section aria-labelledby="about-heading">...</section>
   </main>
   ```
3. **Build mobile layout first**, then add breakpoint overrides
4. **Apply visual design** following the principles below
5. **Test accessibility:**
   - Tab through all interactive elements — logical order, visible focus
   - Check color contrast with browser devtools
   - Verify screen reader announces content correctly (use semantic HTML)
6. **Verify:** run `npm run check` and `npm run lint`

## Workflow: Creating a UI Component

1. **Choose the right element:** use semantic HTML (`<button>`, `<nav>`, `<article>`, `<dialog>`)
2. **Define variants** through props, not separate components:
   ```ts
   interface Props {
   	variant?: 'primary' | 'secondary' | 'ghost';
   	size?: 'sm' | 'md' | 'lg';
   	children: import('svelte').Snippet;
   }
   ```
3. **Apply styles** using conditional Tailwind classes:
   ```svelte
   <button
   	class={[
   		'rounded-lg font-medium transition-all duration-200',
   		'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
   		variant === 'primary' && 'bg-white text-black hover:bg-white/90',
   		variant === 'ghost' && 'bg-transparent text-white hover:bg-white/10',
   		size === 'sm' && 'px-3 py-1.5 text-sm',
   		size === 'md' && 'px-4 py-2 text-base'
   	]}
   >
   	{@render children()}
   </button>
   ```
4. **Add keyboard interaction** where needed (Escape to close, Enter/Space to activate)
5. **Run the Svelte autofixer** before finalizing

## Visual Design Principles

### Typography

- Use a clear type scale with limited sizes (4–6 levels max)
- Body text: `text-base` (16px) minimum, `leading-relaxed` for readability
- Headings: use `font-bold` or `font-semibold`, not both in the same hierarchy
- Limit line length to ~65-75 characters: use `max-w-prose` or `max-w-2xl`

### Spacing

- Use Tailwind's spacing scale consistently — avoid arbitrary values
- Establish a rhythm: sections get `py-16 md:py-24`, inner groups get `space-y-6` or `gap-8`
- Whitespace is a design element — generous spacing signals premium quality

### Color

- Define a minimal palette: 1 primary, 1 accent, neutrals, semantic colors
- Dark backgrounds with light text work well for creative/portfolio sites
- Use opacity modifiers (`text-white/80`, `bg-black/50`) for subtle layering
- Ensure all text passes WCAG AA contrast ratio

### Motion & Transitions

- Keep transitions subtle: `duration-200` to `duration-300`
- Use `transition-all` sparingly — prefer `transition-colors`, `transition-transform`
- Entrance animations: use CSS `@keyframes` or Svelte transitions (`fade`, `fly`, `slide`)
- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
  	*,
  	*::before,
  	*::after {
  		animation-duration: 0.01ms !important;
  		transition-duration: 0.01ms !important;
  	}
  }
  ```

## Responsive Layout Patterns

### Container

```svelte
<div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
	{@render children()}
</div>
```

### Grid

```svelte
<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
	{#each items as item (item.id)}
		<Card {item} />
	{/each}
</div>
```

### Stack

```svelte
<div class="flex flex-col gap-4">
	<!-- Vertical stack with consistent spacing -->
</div>
```

## Accessibility Checklist

For every page or component:

- [ ] All images have descriptive `alt` text (or `alt=""` for decorative)
- [ ] Headings follow a logical hierarchy (`h1` → `h2` → `h3`, no skips)
- [ ] Interactive elements are reachable via keyboard (Tab, Enter, Escape)
- [ ] Focus states are visible (`focus-visible:ring-2`)
- [ ] Color is not the sole indicator of meaning
- [ ] `aria-label` or `aria-labelledby` on sections and landmarks
- [ ] Reduced motion is respected

## Additional Resources

- For responsive patterns and layout recipes, see [references/layout-patterns.md](references/layout-patterns.md)
- For Tailwind v4 conventions, see [references/tailwind-v4.md](references/tailwind-v4.md)
