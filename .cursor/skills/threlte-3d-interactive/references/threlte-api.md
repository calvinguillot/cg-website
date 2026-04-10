# Threlte API Reference

## Canvas

The root component that creates the WebGL renderer:

```svelte
<Canvas
  autoRender={true}
  colorManagementEnabled={true}
  colorSpace="srgb"
  dpr={[1, 2]}
  shadows={true}
  toneMapping={THREE.ACESFilmicToneMapping}
>
  <!-- Scene content -->
</Canvas>
```

Props:
- `autoRender` — auto-renders every frame (default: true)
- `shadows` — enables shadow mapping
- `dpr` — device pixel ratio range [min, max]
- `toneMapping` — Three.js tone mapping constant

## T — The Universal Component

`T` wraps any Three.js class as a Svelte component:

```svelte
<!-- These are equivalent: -->
<T.Mesh position={[0, 1, 0]} />
<T is={THREE.Mesh} position={[0, 1, 0]} />
```

Special props:
- `position` — `[x, y, z]` or individual `position.x`, `position.y`, `position.z`
- `rotation` — `[x, y, z]` in radians, or `rotation.x`, etc.
- `scale` — `[x, y, z]` or single number for uniform scale
- `ref` — bind to get the underlying Three.js object
- `makeDefault` — for cameras, makes it the active camera
- `args` — constructor arguments (e.g., `<T.BoxGeometry args={[1, 1, 1]} />`)
- `attach` — control how child attaches to parent (usually auto-detected)

## Events

Threlte components support pointer events:

```svelte
<T.Mesh
  onclick={(e) => { /* ThreltePointerEvent */ }}
  onpointerenter={(e) => {}}
  onpointerleave={(e) => {}}
  onpointermove={(e) => {}}
>
```

Event object contains:
- `e.object` — the Three.js object
- `e.point` — intersection point (Vector3)
- `e.distance` — distance from camera
- `e.stopPropagation()` — prevent event from reaching objects behind

## useTask

Frame loop hook — runs every frame:

```ts
import { useTask } from '@threlte/core';

useTask((delta) => {
  // delta is time since last frame in seconds
  rotation += delta * speed;
});

// Named tasks with priority:
useTask('physics', (delta) => { ... }, { before: 'render' });
```

## useThrelte

Access the Threlte context:

```ts
import { useThrelte } from '@threlte/core';

const { renderer, scene, camera, size } = useThrelte();
```

## @threlte/extras Components

### OrbitControls

```svelte
<T.PerspectiveCamera makeDefault position={[5, 5, 5]}>
  <OrbitControls
    enableDamping
    autoRotate={false}
    minDistance={2}
    maxDistance={20}
    target={[0, 0, 0]}
  />
</T.PerspectiveCamera>
```

### Environment

```svelte
<Environment
  path="/textures/"
  files="hdr-file.hdr"
  isBackground={true}
/>
```

### Float

Adds floating animation:

```svelte
<Float speed={2} floatIntensity={1} rotationIntensity={0.5}>
  <T.Mesh>...</T.Mesh>
</Float>
```

### Text

3D text using troika-three-text:

```svelte
<Text
  text="Hello World"
  fontSize={0.5}
  color="white"
  anchorX="center"
  anchorY="middle"
/>
```

### ContactShadows

Soft contact shadows on a plane:

```svelte
<ContactShadows
  opacity={0.5}
  blur={2}
  position.y={-0.5}
/>
```

### Suspense

Loading boundary for async resources:

```svelte
<Suspense>
  {#snippet fallback()}
    <LoadingSpinner />
  {/snippet}
  <ModelThatLoads />
</Suspense>
```
