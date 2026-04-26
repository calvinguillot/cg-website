# Shader Recipes for Threlte

## File Setup

Store GLSL files in `src/lib/shaders/` and import with `?raw`:

```ts
import vertexShader from '$lib/shaders/myVertex.glsl?raw';
import fragmentShader from '$lib/shaders/myFragment.glsl?raw';
```

## Basic Vertex Shader Template

```glsl
// vertex.glsl
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

## Recipe: Animated Gradient

```glsl
// gradient.frag
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;

void main() {
  float t = sin(vUv.y * 3.14159 + uTime * 0.5) * 0.5 + 0.5;
  vec3 color = mix(uColorA, uColorB, t);
  gl_FragColor = vec4(color, 1.0);
}
```

## Recipe: Noise Displacement

```glsl
// noise-displace.vert
uniform float uTime;
uniform float uStrength;
varying vec2 vUv;
varying float vDisplacement;

// Simple 3D noise (include your noise function or use a noise library)
float noise(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 45.543))) * 43758.5453);
}

void main() {
  vUv = uv;
  float n = noise(position + uTime * 0.3);
  vDisplacement = n;
  vec3 displaced = position + normal * n * uStrength;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
```

## Recipe: Fresnel / Edge Glow

```glsl
// fresnel.frag
varying vec3 vNormal;
varying vec3 vPosition;
uniform vec3 uColor;
uniform float uFresnelPower;

void main() {
  vec3 viewDir = normalize(cameraPosition - vPosition);
  float fresnel = pow(1.0 - dot(viewDir, vNormal), uFresnelPower);
  gl_FragColor = vec4(uColor * fresnel, fresnel);
}
```

## Uniform Management in Svelte

```svelte
<script lang="ts">
	import { useTask } from '@threlte/core';
	import * as THREE from 'three';

	let time = $state(0);
	useTask((delta) => {
		time += delta;
	});

	let uniforms = $derived({
		uTime: new THREE.Uniform(time),
		uColorA: new THREE.Uniform(new THREE.Color('#0066ff')),
		uColorB: new THREE.Uniform(new THREE.Color('#ff6600')),
		uStrength: new THREE.Uniform(0.3)
	});
</script>

<T.ShaderMaterial vertexShader={vert} fragmentShader={frag} {uniforms} transparent />
```

## Post-Processing

Use `@threlte/extras` or Three.js `EffectComposer` directly:

```svelte
<script lang="ts">
	import { useThrelte, useTask } from '@threlte/core';
	import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
	import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

	const { renderer, scene, camera } = useThrelte();

	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera.current));
	composer.addPass(new UnrealBloomPass(undefined, 1.5, 0.4, 0.85));

	useTask(
		() => {
			composer.render();
		},
		{ autoRender: false }
	);
</script>
```
