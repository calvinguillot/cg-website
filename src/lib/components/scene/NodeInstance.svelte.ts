import { Tween } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';
import type { CvGraphNode } from '$lib/types/cv-graph';

/**
 * Per-node runtime state for the CV graph: hover/selection, layout lerp, pulse.
 */
export default class NodeInstance {
	tw = new Tween(0, { easing: cubicOut, duration: 220 });

	scaleMultiplier = 1.35;
	scaleInit: number;

	/** Layout position (before micro jiggle) — lerped toward cluster target */
	layout = $state({ x: 0, y: 0, z: 0 });
	target = $state({ x: 0, y: 0, z: 0 });

	/** World position passed to Three (layout + jiggle) */
	positions = $state({ x: 0, y: 0, z: 0 });

	selected = $state(false);

	isPulsing = $state(false);
	pulseTime = $state(0);
	pulseFrequency = $state(1);
	pulseIntensity = $state(0.12);
	pulsePhase = $state(0);

	closestNode: NodeInstance | null = null;
	furthestNode: NodeInstance | null = null;

	constructor(
		public node: CvGraphNode,
		_initialHue = 0.55
	) {
		const [px, py, pz] = node.positions.category;
		this.layout = { x: px, y: py, z: pz };
		this.target = { ...this.layout };
		this.positions = { ...this.layout };
		this.scaleInit = 0.35 + Math.min(0.65, node.technologies.length * 0.04);
	}

	get scale(): number {
		const pulse =
			this.isPulsing === true
				? 1 + Math.sin(this.pulseTime * Math.PI * 2 + this.pulsePhase) * this.pulseIntensity
				: 1;
		return (this.tw.current * this.scaleMultiplier + this.scaleInit) * pulse;
	}

	setClusterPosition(mode: 'category' | 'technology' | 'year', immediate = false): void {
		const p = this.node.positions[mode];
		this.target = { x: p[0], y: p[1], z: p[2] };
		if (immediate) {
			this.layout = { ...this.target };
			this.positions = { ...this.layout };
		}
	}

	stepLayout(delta: number, speed = 2.6): void {
		const t = Math.min(1, delta * speed);
		this.layout.x += (this.target.x - this.layout.x) * t;
		this.layout.y += (this.target.y - this.layout.y) * t;
		this.layout.z += (this.target.z - this.layout.z) * t;
	}

	startPulsing(): void {
		this.isPulsing = true;
		this.pulseTime = 0;
	}

	stopPulsing(): void {
		this.isPulsing = false;
		this.pulseTime = 0;
	}

	updatePulse(delta: number): void {
		if (this.isPulsing) {
			this.pulseTime += delta * 2 * this.pulseFrequency;
		}
	}

	configurePulse(frequency = 1, intensity = 0.12, phase = 0): void {
		this.pulseFrequency = frequency;
		this.pulseIntensity = intensity;
		this.pulsePhase = phase;
	}

	getDistanceTo(other: NodeInstance): number {
		const dx = this.positions.x - other.positions.x;
		const dy = this.positions.y - other.positions.y;
		const dz = this.positions.z - other.positions.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	calculateNearestAndFurthest(all: NodeInstance[]): void {
		if (all.length <= 1) {
			this.closestNode = null;
			this.furthestNode = null;
			return;
		}
		let minD = Infinity;
		let maxD = -1;
		let closest: NodeInstance | null = null;
		let furthest: NodeInstance | null = null;
		for (const inst of all) {
			if (inst === this) continue;
			const d = this.getDistanceTo(inst);
			if (d < minD) {
				minD = d;
				closest = inst;
			}
			if (d > maxD) {
				maxD = d;
				furthest = inst;
			}
		}
		this.closestNode = closest;
		this.furthestNode = furthest;
	}
}
