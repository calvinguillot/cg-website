<script lang="ts">
	import { onMount } from 'svelte';
	import { untrack } from 'svelte';
	import { CatmullRomCurve3, Vector3 } from 'three';
	import { EffectComposer } from 'threlte-postprocessing';
	import { BloomEffect, VignetteEffect } from 'threlte-postprocessing/effects';
	import { T, useTask } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMesh,
		CameraControls,
		type CameraControlsRef,
		MeshLineGeometry,
		MeshLineMaterial
	} from '@threlte/extras';
	import type { CvGraphData, CvGraphNode, ClusterModeId } from '$lib/types/cv-graph';
	import NodeInstance from './NodeInstance.svelte.ts';

	let {
		graph,
		clusterMode = 'category',
		selectedNode = $bindable<CvGraphNode | null>(null),
		controls = $bindable<CameraControlsRef | undefined>(undefined)
	}: {
		graph: CvGraphData;
		clusterMode: ClusterModeId;
		selectedNode?: CvGraphNode | null;
		controls?: CameraControlsRef | undefined;
	} = $props();

	const cameraOffset = 14;
	const minZoom = 4;
	const maxZoom = 120;
	const lineWidth = 0.06;
	const lineOpacity = 0.4;
	const hitRadius = 1.1;

	interactivity({
		filter(items) {
			return items.slice(0, 1);
		}
	});

	let instances = $state<NodeInstance[]>([]);
	let edgeLinePoints = $state<Vector3[][]>([]);
	let animT = 0;
	let mounted = false;
	let lastClusterMode: ClusterModeId | null = null;

	function buildInstances(data: CvGraphData): NodeInstance[] {
		return data.nodes.map((n) => new NodeInstance(n));
	}

	function computeEdgeLines(list: NodeInstance[], edges: CvGraphData['edges']): Vector3[][] {
		const map = new Map<string, NodeInstance>();
		for (const inst of list) map.set(inst.node.id, inst);
		const out: Vector3[][] = [];
		for (const e of edges) {
			const a = map.get(e.source);
			const b = map.get(e.target);
			if (!a || !b) continue;
			const start = new Vector3(a.layout.x, a.layout.y, a.layout.z);
			const end = new Vector3(b.layout.x, b.layout.y, b.layout.z);
			const mid = start.clone().lerp(end, 0.5);
			mid.y += start.distanceTo(end) * 0.12;
			const curve = new CatmullRomCurve3([start, mid, end]);
			out.push(curve.getPoints(30));
		}
		return out;
	}

	function computeCentroid(list: NodeInstance[]): { x: number; y: number; z: number } {
		if (list.length === 0) return { x: 0, y: 0, z: 0 };
		let sx = 0,
			sy = 0,
			sz = 0;
		for (const i of list) {
			sx += i.layout.x;
			sy += i.layout.y;
			sz += i.layout.z;
		}
		const n = list.length;
		return { x: sx / n, y: sy / n, z: sz / n };
	}

	function applyClusterMode(mode: ClusterModeId, immediate: boolean) {
		for (const inst of instances) {
			inst.setClusterPosition(mode, immediate);
		}
		edgeLinePoints = computeEdgeLines(instances, graph.edges);
	}

	onMount(() => {
		instances = buildInstances(graph);
		applyClusterMode('category', true);
		lastClusterMode = 'category';
		mounted = true;

		edgeLinePoints = computeEdgeLines(instances, graph.edges);

		requestAnimationFrame(() => {
			if (controls) {
				controls.minDistance = minZoom;
				controls.maxDistance = maxZoom;
				const c = computeCentroid(instances);
				controls.setLookAt(c.x + 30, c.y + 20, c.z + 30, c.x, c.y, c.z, false);
			}
		});
	});

	$effect(() => {
		const mode = clusterMode;
		if (!mounted || instances.length === 0) return;
		const prev = untrack(() => lastClusterMode);
		const immediate = prev === null;
		applyClusterMode(mode, immediate);
		lastClusterMode = mode;
	});

	$effect(() => {
		if (selectedNode !== null || instances.length === 0) return;
		for (const inst of instances) {
			inst.stopPulsing();
			inst.selected = false;
			inst.tw.set(0);
		}
	});

	function pulseNeighbors(inst: NodeInstance) {
		const id = inst.node.id;
		for (const e of graph.edges) {
			let otherId: string | null = null;
			if (e.source === id) otherId = e.target;
			else if (e.target === id) otherId = e.source;
			if (!otherId) continue;
			const other = instances.find((x) => x.node.id === otherId);
			if (!other || other === inst) continue;
			other.configurePulse(0.85 + Math.random() * 0.2, 0.1, Math.random() * Math.PI * 2);
			other.startPulsing();
		}
	}

	function onSelectInstance(instance: NodeInstance) {
		for (const i of instances) {
			i.stopPulsing();
			i.selected = false;
			i.tw.set(0);
		}
		instance.selected = true;
		instance.tw.set(1);
		pulseNeighbors(instance);
		selectedNode = instance.node;
		if (controls) {
			controls.setLookAt(
				instance.positions.x + cameraOffset * 0.35,
				instance.positions.y + cameraOffset * 0.25,
				instance.positions.z + cameraOffset * 0.35,
				instance.positions.x,
				instance.positions.y,
				instance.positions.z,
				true
			);
		}
	}

	let edgeRefreshTimer = 0;

	useTask((delta) => {
		if (!mounted || instances.length === 0) return;

		animT += delta;
		edgeRefreshTimer += delta;

		for (let i = 0; i < instances.length; i++) {
			const inst = instances[i];
			inst.stepLayout(delta);

			const seed = i * 73.137;
			const nx = Math.sin(seed + animT * 0.7) * 0.04;
			const ny = Math.cos(seed * 1.3 + animT * 0.6) * 0.04;
			const nz = Math.sin(seed * 0.7 + animT * 0.8) * 0.04;
			inst.positions.x = inst.layout.x + nx;
			inst.positions.y = inst.layout.y + ny;
			inst.positions.z = inst.layout.z + nz;

			inst.updatePulse(delta);
		}

		if (edgeRefreshTimer > 0.5) {
			edgeRefreshTimer = 0;
			edgeLinePoints = computeEdgeLines(instances, graph.edges);
		}
	});
</script>

<T.PerspectiveCamera makeDefault position={[35, 22, 35]} fov={50}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<T.Color attach="background" args={['#000000']} />

<EffectComposer>
	<BloomEffect
		luminanceThreshold={0.15}
		luminanceSmoothing={0.35}
		height={320}
		intensity={3.5}
		radius={0.55}
	/>
	<VignetteEffect eskil={false} offset={0.08} darkness={1.05} />

	{#each edgeLinePoints as linePoints, idx (idx)}
		<T.Mesh>
			<MeshLineGeometry points={linePoints} />
			<MeshLineMaterial
				color="#6eb8ff"
				width={lineWidth}
				opacity={lineOpacity}
				transparent={true}
				toneMapped={false}
			/>
		</T.Mesh>
	{/each}

	<InstancedMesh>
		<T.SphereGeometry args={[hitRadius, 8, 8]} />
		<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={0} toneMapped={false} />
		{#each instances as instance (instance.node.id)}
			<Instance
				position.x={instance.positions.x}
				position.y={instance.positions.y}
				position.z={instance.positions.z}
				onclick={() => onSelectInstance(instance)}
				onpointerenter={() => {
					if (!instance.selected) instance.tw.set(1);
				}}
				onpointerleave={() => {
					if (!instance.selected) instance.tw.set(0);
				}}
			/>
		{/each}
	</InstancedMesh>

	<InstancedMesh>
		<T.SphereGeometry args={[0.45, 16, 16]} />
		<T.MeshBasicMaterial color="#ffffff" toneMapped={false} />
		{#each instances as instance (instance.node.id)}
			<Instance
				position.x={instance.positions.x}
				position.y={instance.positions.y}
				position.z={instance.positions.z}
				scale={instance.scale}
				onclick={() => onSelectInstance(instance)}
				onpointerenter={() => {
					if (!instance.selected) instance.tw.set(1);
				}}
				onpointerleave={() => {
					if (!instance.selected) instance.tw.set(0);
				}}
			/>
		{/each}
	</InstancedMesh>
</EffectComposer>
