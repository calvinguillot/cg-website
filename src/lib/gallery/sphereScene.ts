import {
	Scene,
	PerspectiveCamera,
	WebGLRenderer,
	Group,
	Mesh,
	PlaneGeometry,
	MeshBasicMaterial,
	CanvasTexture,
	SRGBColorSpace,
	Raycaster,
	Vector2,
	Vector3,
	Color,
	BufferGeometry,
	Float32BufferAttribute,
	Points,
	PointsMaterial,
	FogExp2,
	MathUtils,
	DoubleSide
} from 'three';
import type { GalleryItem } from '$lib/data/gallery';

export type ScreenPoint = { x: number; y: number };

export type SphereGalleryOptions = {
	canvas: HTMLCanvasElement;
	items: GalleryItem[];
	onHoverChange?: (item: GalleryItem | null) => void;
	onSelect?: (item: GalleryItem, screen: ScreenPoint) => void;
};

export type SphereGalleryController = {
	dispose: () => void;
	focus: (id: string) => void;
	setInteractive: (value: boolean) => void;
};

const RADIUS = 18;
const CARD_W = 4.7;
const CARD_H = 2.95;
const HOVER_SCALE = 1.16;
const PITCH_LIMIT = 1.15;
const TEX_W = 1024;
const TEX_H = 640;

type CardMesh = Mesh<PlaneGeometry, MeshBasicMaterial> & {
	userData: {
		item: GalleryItem;
		dir: Vector3;
		currentScale: number;
		targetScale: number;
		texture: CanvasTexture;
	};
};

function relativeLuminance(hex: string): number {
	const c = new Color(hex);
	return 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.arcTo(x + w, y, x + w, y + h, r);
	ctx.arcTo(x + w, y + h, x, y + h, r);
	ctx.arcTo(x, y + h, x, y, r);
	ctx.arcTo(x, y, x + w, y, r);
	ctx.closePath();
}

function wrapText(
	ctx: CanvasRenderingContext2D,
	text: string,
	maxWidth: number,
	maxLines: number
): string[] {
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let line = '';
	for (const word of words) {
		const test = line ? `${line} ${word}` : word;
		if (ctx.measureText(test).width > maxWidth && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines - 1) break;
		} else {
			line = test;
		}
	}
	if (line && lines.length < maxLines) lines.push(line);
	// Truncate the last line if there is overflow.
	const consumed = lines.join(' ').split(/\s+/).length;
	if (consumed < words.length && lines.length) {
		let last = lines[lines.length - 1];
		while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 1) {
			last = last.slice(0, -1).trimEnd();
		}
		lines[lines.length - 1] = `${last}…`;
	}
	return lines;
}

function buildCardTexture(item: GalleryItem): CanvasTexture {
	const canvas = document.createElement('canvas');
	canvas.width = TEX_W;
	canvas.height = TEX_H;
	const ctx = canvas.getContext('2d')!;
	const pad = 56;
	const radius = 40;

	roundedRectPath(ctx, 0, 0, TEX_W, TEX_H, radius);
	ctx.clip();

	// Solid colour fill (stand-in for imagery).
	ctx.fillStyle = item.color;
	ctx.fillRect(0, 0, TEX_W, TEX_H);

	// Soft top-light sheen.
	const sheen = ctx.createLinearGradient(0, 0, 0, TEX_H);
	sheen.addColorStop(0, 'rgba(255,255,255,0.14)');
	sheen.addColorStop(0.4, 'rgba(255,255,255,0)');
	sheen.addColorStop(1, 'rgba(0,0,0,0.32)');
	ctx.fillStyle = sheen;
	ctx.fillRect(0, 0, TEX_W, TEX_H);

	const dark = relativeLuminance(item.color) > 0.6;
	const ink = dark ? 'rgba(12,15,22,0.92)' : 'rgba(255,255,255,0.96)';
	const inkSoft = dark ? 'rgba(12,15,22,0.62)' : 'rgba(255,255,255,0.7)';

	// Top label: TYPE · YEAR
	ctx.fillStyle = inkSoft;
	ctx.font = '600 30px Inter, system-ui, sans-serif';
	ctx.textBaseline = 'top';
	ctx.fillText(`${item.type.toUpperCase()}  ·  ${item.year}`, pad, pad);

	// Title (bottom aligned, wrapped).
	ctx.fillStyle = ink;
	ctx.font = '700 64px Inter, system-ui, sans-serif';
	const lines = wrapText(ctx, item.title, TEX_W - pad * 2, 3);
	const lineHeight = 74;
	let ty = TEX_H - pad - lines.length * lineHeight + 8;
	for (const line of lines) {
		ctx.fillText(line, pad, ty);
		ty += lineHeight;
	}

	// Inner border.
	roundedRectPath(ctx, 3, 3, TEX_W - 6, TEX_H - 6, radius - 2);
	ctx.lineWidth = 3;
	ctx.strokeStyle = dark ? 'rgba(12,15,22,0.18)' : 'rgba(255,255,255,0.22)';
	ctx.stroke();

	const texture = new CanvasTexture(canvas);
	texture.colorSpace = SRGBColorSpace;
	texture.anisotropy = 4;
	return texture;
}

function fibonacciDirection(i: number, count: number): Vector3 {
	const golden = Math.PI * (3 - Math.sqrt(5));
	const y = (1 - ((i + 0.5) / count) * 2) * 0.9;
	const r = Math.sqrt(Math.max(0, 1 - y * y));
	const theta = golden * i;
	return new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).normalize();
}

export function createSphereGallery(options: SphereGalleryOptions): SphereGalleryController {
	const { canvas, items, onHoverChange, onSelect } = options;

	const renderer = new WebGLRenderer({ canvas, antialias: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const scene = new Scene();
	scene.background = new Color('#06070c');
	scene.fog = new FogExp2('#06070c', 0.012);

	const camera = new PerspectiveCamera(58, 1, 0.1, 200);
	camera.rotation.order = 'YXZ';
	camera.position.set(0, 0, 0);

	const cardsGroup = new Group();
	scene.add(cardsGroup);

	const cards: CardMesh[] = [];
	const geometry = new PlaneGeometry(CARD_W, CARD_H);

	items.forEach((item, i) => {
		const texture = buildCardTexture(item);
		const material = new MeshBasicMaterial({
			map: texture,
			transparent: true,
			side: DoubleSide,
			fog: true
		});
		const mesh = new Mesh(geometry, material) as CardMesh;
		const dir = fibonacciDirection(i, items.length);
		mesh.position.copy(dir).multiplyScalar(RADIUS);
		mesh.lookAt(0, 0, 0);
		mesh.userData = { item, dir, currentScale: 1, targetScale: 1, texture };
		cards.push(mesh);
		cardsGroup.add(mesh);
	});

	// Ambient star field for depth/parallax.
	const starCount = 900;
	const starPos = new Float32Array(starCount * 3);
	for (let i = 0; i < starCount; i++) {
		const dir = new Vector3(
			Math.random() * 2 - 1,
			Math.random() * 2 - 1,
			Math.random() * 2 - 1
		).normalize();
		const d = 34 + Math.random() * 28;
		starPos[i * 3] = dir.x * d;
		starPos[i * 3 + 1] = dir.y * d;
		starPos[i * 3 + 2] = dir.z * d;
	}
	const starGeo = new BufferGeometry();
	starGeo.setAttribute('position', new Float32BufferAttribute(starPos, 3));
	const stars = new Points(
		starGeo,
		new PointsMaterial({ color: '#5a6072', size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.7 })
	);
	scene.add(stars);

	// --- Interaction state ---
	let yaw = 0;
	let pitch = 0;
	let targetYaw = 0;
	let targetPitch = 0;
	let velYaw = 0;
	let velPitch = 0;
	let dragging = false;
	let interactive = true;
	let idleTime = 0;
	let pointerDown: { x: number; y: number; t: number } | null = null;
	let lastPointer = { x: 0, y: 0 };

	const raycaster = new Raycaster();
	const ndc = new Vector2();
	let hovered: CardMesh | null = null;

	function size() {
		const w = canvas.clientWidth || window.innerWidth;
		const h = canvas.clientHeight || window.innerHeight;
		renderer.setSize(w, h, false);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}

	function setNdc(e: PointerEvent) {
		const rect = canvas.getBoundingClientRect();
		ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
	}

	function pickCard(): CardMesh | null {
		raycaster.setFromCamera(ndc, camera);
		const hits = raycaster.intersectObjects(cards, false);
		return hits.length ? (hits[0].object as CardMesh) : null;
	}

	function onPointerDown(e: PointerEvent) {
		if (!interactive) return;
		dragging = true;
		idleTime = 0;
		velYaw = 0;
		velPitch = 0;
		pointerDown = { x: e.clientX, y: e.clientY, t: performance.now() };
		lastPointer = { x: e.clientX, y: e.clientY };
		canvas.setPointerCapture?.(e.pointerId);
	}

	function onPointerMove(e: PointerEvent) {
		if (dragging) {
			const dx = e.clientX - lastPointer.x;
			const dy = e.clientY - lastPointer.y;
			lastPointer = { x: e.clientX, y: e.clientY };
			const k = 0.0042;
			targetYaw -= dx * k;
			targetPitch -= dy * k;
			targetPitch = MathUtils.clamp(targetPitch, -PITCH_LIMIT, PITCH_LIMIT);
			velYaw = -dx * k;
			velPitch = -dy * k;
			idleTime = 0;
		} else if (interactive) {
			setNdc(e);
			const hit = pickCard();
			if (hit !== hovered) {
				if (hovered) hovered.userData.targetScale = 1;
				hovered = hit;
				if (hovered) hovered.userData.targetScale = HOVER_SCALE;
				canvas.style.cursor = hovered ? 'pointer' : 'grab';
				onHoverChange?.(hovered ? hovered.userData.item : null);
			}
		}
	}

	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		dragging = false;
		canvas.releasePointerCapture?.(e.pointerId);
		if (pointerDown) {
			const moved = Math.hypot(e.clientX - pointerDown.x, e.clientY - pointerDown.y);
			const dt = performance.now() - pointerDown.t;
			if (moved < 7 && dt < 450 && interactive) {
				setNdc(e);
				const hit = pickCard();
				if (hit && onSelect) {
					onSelect(hit.userData.item, { x: e.clientX, y: e.clientY });
				}
			}
		}
		pointerDown = null;
	}

	canvas.addEventListener('pointerdown', onPointerDown);
	canvas.addEventListener('pointermove', onPointerMove);
	canvas.addEventListener('pointerup', endDrag);
	canvas.addEventListener('pointercancel', endDrag);
	window.addEventListener('resize', size);

	function focus(id: string) {
		const card = cards.find((c) => c.userData.item.id === id);
		if (!card) return;
		const d = card.userData.dir;
		targetPitch = MathUtils.clamp(Math.asin(MathUtils.clamp(d.y, -1, 1)), -PITCH_LIMIT, PITCH_LIMIT);
		targetYaw = Math.atan2(-d.x, -d.z);
		// Pick the shortest rotational path so the camera doesn't spin the long way.
		while (targetYaw - yaw > Math.PI) targetYaw -= Math.PI * 2;
		while (targetYaw - yaw < -Math.PI) targetYaw += Math.PI * 2;
		velYaw = 0;
		velPitch = 0;
	}

	function setInteractive(value: boolean) {
		interactive = value;
		if (!value) {
			dragging = false;
			if (hovered) {
				hovered.userData.targetScale = 1;
				hovered = null;
			}
		}
	}

	let raf = 0;
	let lastT = performance.now();

	function loop() {
		raf = requestAnimationFrame(loop);
		const now = performance.now();
		const dt = Math.min(0.05, (now - lastT) / 1000);
		lastT = now;

		if (!dragging) {
			targetYaw += velYaw;
			targetPitch += velPitch;
			targetPitch = MathUtils.clamp(targetPitch, -PITCH_LIMIT, PITCH_LIMIT);
			velYaw *= 0.94;
			velPitch *= 0.94;
			if (Math.abs(velYaw) < 0.00002) velYaw = 0;
			if (Math.abs(velPitch) < 0.00002) velPitch = 0;

			idleTime += dt;
			if (interactive && idleTime > 3 && velYaw === 0) {
				targetYaw += 0.018 * dt;
			}
		}

		// Lenis-style eased follow.
		yaw += (targetYaw - yaw) * 0.085;
		pitch += (targetPitch - pitch) * 0.085;
		camera.rotation.y = yaw;
		camera.rotation.x = pitch;

		for (const card of cards) {
			const u = card.userData;
			u.currentScale += (u.targetScale - u.currentScale) * 0.18;
			card.scale.setScalar(u.currentScale);
		}

		stars.rotation.y += dt * 0.004;
		renderer.render(scene, camera);
	}

	size();
	loop();

	function dispose() {
		cancelAnimationFrame(raf);
		canvas.removeEventListener('pointerdown', onPointerDown);
		canvas.removeEventListener('pointermove', onPointerMove);
		canvas.removeEventListener('pointerup', endDrag);
		canvas.removeEventListener('pointercancel', endDrag);
		window.removeEventListener('resize', size);
		geometry.dispose();
		starGeo.dispose();
		(stars.material as PointsMaterial).dispose();
		for (const card of cards) {
			card.material.dispose();
			card.userData.texture.dispose();
		}
		renderer.dispose();
	}

	return { dispose, focus, setInteractive };
}
