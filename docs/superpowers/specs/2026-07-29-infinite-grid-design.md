# Infinite Grid Gallery Design

## Overview
Transition the portfolio gallery from a 3D spherical layout (Threlte/WebGL) to a 2D infinite draggable grid using standard DOM elements and GSAP.

## Data Source
- **File**: `src/lib/data/data.json`
- **Content**: Extracted nodes from `cv-graph.json`.
- **Changes**: Remove `positions`, `edges`, and clustering configuration. Keep all node types (education, work, art, talk, software).
- **Integration**: Update `src/lib/data/gallery.ts` to consume `data.json` instead of `cv-graph.json`.

## Architecture & Components

### 1. `InfiniteGallery.svelte` (replaces `SphereGallery.svelte`)
- **Container**: Full-screen `div` with `overflow: hidden` and `touch-none` to prevent default scrolling.
- **Grid Items**: Rendered as absolutely positioned `div` elements. Each item is forced to be square (`aspect-square`).
- **Styling**: 
  - Background color mapped from the item's type.
  - Hover state: Elegant white outline (`ring-2 ring-white/50` or similar), slight scale up (`scale-105`), and a smooth transition (`transition-all duration-300`).

### 2. Interaction & Animation (GSAP)
- **Dragging**: Use `gsap.Observer` to listen to `onDrag` and `onWheel` events. Update a global `x` and `y` offset based on the drag delta.
- **Infinite Wrapping**: 
  - Calculate a grid size based on the number of items (e.g., a 6x5 grid for 30 items).
  - Use `gsap.utils.wrap` to wrap the `x` and `y` positions of each item. If an item moves beyond the grid bounds, it wraps to the opposite side.
  - Use `gsap.ticker` or `gsap.set` to continuously update the positions of the DOM elements based on the global offset.
- **Entry Animation**: Staggered fade-in and scale-up of the grid items when the component mounts.
- **Exit/Selection**: On click, trigger the existing expanding bubble transition (using the item's color) and navigate to the project page.

## Data Flow
1. `+page.svelte` loads `galleryItems` from `gallery.ts`.
2. Passes `items` to `InfiniteGallery.svelte`.
3. `InfiniteGallery.svelte` calculates the grid layout (rows, columns, cell size).
4. GSAP Observer updates the virtual camera/offset.
5. GSAP updates the DOM elements' transform translations.

## Edge Cases & Considerations
- **Window Resize**: Recalculate grid cell sizes and bounds on window resize.
- **Performance**: Use `will-change: transform` and GSAP's `x/y` (which use `transform: translate3d`) to ensure GPU acceleration.
- **Accessibility**: Ensure items are focusable via keyboard and can be activated with the Enter key.
