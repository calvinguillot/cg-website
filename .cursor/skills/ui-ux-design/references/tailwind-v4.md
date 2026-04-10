# TailwindCSS v4 Conventions

## Key Differences from v3

Tailwind v4 uses CSS-native configuration instead of `tailwind.config.js`:

- Configuration happens in CSS via `@theme` directive
- No config file needed for most projects
- Import via Vite plugin (`@tailwindcss/vite`), not PostCSS

## Theme Customization

Define custom values in your main CSS file (e.g., `layout.css`):

```css
@import 'tailwindcss';

@theme {
  --color-brand: #your-color;
  --color-surface: oklch(0.15 0.01 260);
  --font-display: 'Your Font', system-ui, sans-serif;
}
```

Then use in templates: `text-brand`, `bg-surface`, `font-display`.

## Arbitrary Values

When Tailwind doesn't have the exact value:

```svelte
<div class="grid-cols-[2fr_1fr] gap-[clamp(1rem,3vw,3rem)]">
```

Prefer Tailwind's scale when possible. Use arbitrary values sparingly.

## Dark Mode

Tailwind v4 supports `dark:` variant based on `prefers-color-scheme` by default.
For manual toggle, use a class strategy in your CSS:

```css
@custom-variant dark (&:where(.dark, .dark *));
```

## Container Queries

Tailwind v4 supports container queries natively:

```svelte
<div class="@container">
  <div class="@sm:grid-cols-2 @lg:grid-cols-3 grid grid-cols-1">
    <!-- Responds to container width, not viewport -->
  </div>
</div>
```

## Composing Classes

Use Svelte 5's array/object syntax for conditional classes (via clsx-style):

```svelte
<div class={[
  'base-classes',
  isActive && 'active-classes',
  size === 'lg' && 'large-classes'
]}>
```

Do NOT use the `class:` directive — use the array pattern above instead.
