---
name: threlte-3d-interactive
description: >
  Use when creating 3D scenes, WebGL visuals, interactive Three.js experiences,
  or any work involving @threlte/core, @threlte/extras, or Three.js in Svelte.
  Handles scene setup, camera, lighting, models, shaders, animation loops,
  user interaction, and performance optimization. Do NOT use for 2D UI layouts
  or non-3D components.
---

# Threlte 3D Interactive

## Critical Rules

- This project uses **@threlte/core v8** and **@threlte/extras v9** with **Three.js r183**
- Threlte is Svelte-native — use Threlte components, not raw Three.js imperatively
- All 3D components go in `src/lib/components/three/`
- Heavy assets (models, textures) go in `static/models/` or `static/textures/`
- Always dispose of geometries, materials, and textures when components unmount
- Three.js objects are client-only — guard with `{#if}` or dynamic imports if SSR is a concern

## Workflow: Creating a 3D Scene

1. **Create a wrapper component** in `src/lib/components/three/`:
   ```svelte
   <!-- Scene.svelte -->
   <script lang="ts">
     import { Canvas } from '@threlte/core';
     import SceneContent from './SceneContent.svelte';
   </script>

   <Canvas>
     <SceneContent />
   </Canvas>
   ```
2. **Create the scene content** in a separate component (keeps Canvas clean):
   ```svelte
   <!-- SceneContent.svelte -->
   <script lang="ts">
     import { T } from '@threlte/core';
     import { OrbitControls } from '@threlte/extras';
   </script>

   <T.PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50}>
     <OrbitControls enableDamping />
   </T.PerspectiveCamera>

   <T.DirectionalLight position={[10, 10, 5]} intensity={1.5} />
   <T.AmbientLight intensity={0.3} />

   <T.Mesh>
     <T.BoxGeometry args={[1, 1, 1]} />
     <T.MeshStandardMaterial color="#ff6600" />
   </T.Mesh>
   ```
3. **Embed in a page** with a sized container:
   ```svelte
   <div class="h-svh w-full">
     <Scene />
   </div>
   ```
4. **Verify:** open the page in the browser and confirm the scene renders
5. **Run the Svelte autofixer** on all new `.svelte` files

## Workflow: Adding Interactive 3D Objects

1. **Attach event handlers** directly on `<T.Mesh>`:
   ```svelte
   <T.Mesh
     onclick={(e) => handleClick(e)}
     onpointerenter={() => hovered = true}
     onpointerleave={() => hovered = false}
   >
     <T.SphereGeometry args={[1, 32, 32]} />
     <T.MeshStandardMaterial color={hovered ? '#ff0000' : '#ffffff'} />
   </T.Mesh>
   ```
2. **For hover cursor changes**, set `document.body.style.cursor` in pointer events
3. **For animations**, use the `useTask` hook from `@threlte/core`:
   ```svelte
   <script lang="ts">
     import { useTask } from '@threlte/core';
     import { DEG2RAD } from 'three/src/math/MathUtils.js';

     let rotation = $state(0);

     useTask((delta) => {
       rotation += delta * 45 * DEG2RAD;
     });
   </script>

   <T.Mesh rotation.y={rotation}>
     <!-- geometry + material -->
   </T.Mesh>
   ```

## Workflow: Loading 3D Models

1. **Place model files** in `static/models/` (GLTF/GLB preferred)
2. **Use the `useGltf` hook** from `@threlte/extras`:
   ```svelte
   <script lang="ts">
     import { useGltf } from '@threlte/extras';

     const gltf = useGltf('/models/my-model.glb');
   </script>

   {#if $gltf}
     <T is={$gltf.scene} />
   {/if}
   ```
3. **For complex models**, extract specific meshes:
   ```svelte
   {#if $gltf}
     <T is={$gltf.nodes.MeshName} />
   {/if}
   ```
4. **Optimize models before importing:**
   - Use `gltf-transform` or `gltfjsx` CLI to compress
   - Keep polygon count reasonable (< 100k for web)
   - Use Draco compression for large models

## Workflow: Custom Shaders

1. **Create shader files** in `src/lib/shaders/`:
   ```glsl
   // fragment.glsl
   uniform float uTime;
   uniform vec3 uColor;
   varying vec2 vUv;

   void main() {
     float strength = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
     gl_FragColor = vec4(uColor * strength, 1.0);
   }
   ```
2. **Use `T.ShaderMaterial`** with uniforms managed via `$state`:
   ```svelte
   <script lang="ts">
     import { useTask } from '@threlte/core';
     import vertexShader from '$lib/shaders/vertex.glsl?raw';
     import fragmentShader from '$lib/shaders/fragment.glsl?raw';
     import * as THREE from 'three';

     let time = $state(0);
     useTask((delta) => { time += delta; });

     let uniforms = $derived({
       uTime: { value: time },
       uColor: { value: new THREE.Color('#ff6600') }
     });
   </script>

   <T.Mesh>
     <T.PlaneGeometry args={[2, 2, 32, 32]} />
     <T.ShaderMaterial {vertexShader} {fragmentShader} {uniforms} />
   </T.Mesh>
   ```

## Performance Rules

- **Reuse geometries and materials** — create once, share across instances
- **Use `<T.InstancedMesh>`** for many identical objects (> 50 instances)
- **Limit draw calls:** merge static geometry when possible
- **Texture optimization:**
  - Use power-of-two dimensions (512, 1024, 2048)
  - Use compressed formats (WebP for textures, KTX2 for GPU)
  - Set `texture.minFilter = THREE.LinearMipMapLinearFilter`
- **Dispose on cleanup** — Threlte handles this automatically for `<T>` components,
  but manually created objects need `object.dispose()` in an effect cleanup
- **Use `<Suspense>`** from `@threlte/extras` to show loading states for async assets
- **Target 60fps** — monitor with `stats.js` or browser devtools performance panel

## SSR / Static Build Considerations

Three.js requires the DOM. For adapter-static builds:

- The `<Canvas>` component only renders on the client
- If importing Three.js modules at the top level causes SSR errors, use dynamic imports:
  ```svelte
  <script lang="ts">
    import { onMount } from 'svelte';

    let SceneComponent: typeof import('./Scene.svelte').default;
    onMount(async () => {
      SceneComponent = (await import('./Scene.svelte')).default;
    });
  </script>

  {#if SceneComponent}
    <SceneComponent />
  {/if}
  ```

## Additional Resources

- For Threlte component API details, see [references/threlte-api.md](references/threlte-api.md)
- For shader recipes and GLSL patterns, see [references/shader-recipes.md](references/shader-recipes.md)
