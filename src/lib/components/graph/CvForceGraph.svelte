<script lang="ts">
	import {
		forceLink,
		forceManyBody,
		forceSimulation,
		forceX,
		forceY,
		type Simulation,
		type SimulationLinkDatum,
		type SimulationNodeDatum
	} from 'd3';
	import { untrack } from 'svelte';
	import type { ClusterModeId, CvGraphData, CvGraphNode } from '$lib/types/cv-graph';

	type GraphNode = SimulationNodeDatum & {
		id: string;
		title: string;
		kind: 'center' | 'data';
		color: string;
		radius: number;
		targetX: number;
		targetY: number;
		sourceNode?: CvGraphNode;
	};

	type GraphLink = SimulationLinkDatum<GraphNode> & {
		isCenterLink: boolean;
	};

	type GraphRuntime = {
		render: () => void;
		simulation: Simulation<GraphNode, GraphLink>;
		updateTargets: (selectedMode: ClusterModeId) => void;
	};

	interface Props {
		graph: CvGraphData;
		mode: ClusterModeId;
		onselect: (node: CvGraphNode) => void;
	}

	const centerNodeId = 'calvin-center';
	const colorByType: Record<string, string> = {
		education: '#67e8f9',
		work: '#a78bfa',
		project: '#facc15',
		art: '#fb7185',
		research: '#34d399'
	};

	let { graph, mode, onselect }: Props = $props();
	let canvasElement: HTMLCanvasElement | undefined = $state();
	let containerElement: HTMLDivElement | undefined = $state();
	let hoveredNode: GraphNode | null = $state(null);
	let pointerX = $state(0);
	let pointerY = $state(0);
	let pickerNodeId = $state('');
	let currentMode: ClusterModeId | null = null;
	let graphRuntime: GraphRuntime | null = null;

	let pickerNode = $derived(graph.nodes.find((node) => node.id === pickerNodeId) ?? graph.nodes[0]);
	let activeModeLabel = $derived(
		graph.clusterModes.find((clusterMode) => clusterMode.id === mode)?.label ?? mode
	);

	$effect(() => {
		const canvas = canvasElement;
		const container = containerElement;
		if (!canvas || !container) return;

		const context = canvas.getContext('2d');
		if (!context) return;
		const graphCanvas: HTMLCanvasElement = canvas;
		const graphContainer: HTMLDivElement = container;
		const graphContext: CanvasRenderingContext2D = context;

		let width = 1;
		let height = 1;
		let pixelRatio = window.devicePixelRatio || 1;
		let animationFrame = 0;

		const scale = () => Math.max(6, Math.min(18, Math.min(width, height) / 82));
		const targetX = (node: CvGraphNode, selectedMode: ClusterModeId) =>
			node.positions[selectedMode][0] * scale();
		const targetY = (node: CvGraphNode, selectedMode: ClusterModeId) =>
			node.positions[selectedMode][1] * scale();

		const nodes: GraphNode[] = [
			{
				id: centerNodeId,
				title: 'Calvin',
				kind: 'center',
				color: '#ffffff',
				radius: 18,
				targetX: 0,
				targetY: 0,
				x: 0,
				y: 0,
				fx: 0,
				fy: 0
			},
			...graph.nodes.map((node, index) => {
				const angle = (index / Math.max(1, graph.nodes.length)) * Math.PI * 2;
				const distance = 72 + (index % 4) * 14;

				return {
					id: node.id,
					title: node.title,
					kind: 'data' as const,
					color: colorByType[node.type] ?? '#38bdf8',
					radius: node.type === 'work' ? 8 : 7,
					targetX: 0,
					targetY: 0,
					sourceNode: node,
					x: Math.cos(angle) * distance,
					y: Math.sin(angle) * distance
				};
			})
		];

		const links: GraphLink[] = [
			...graph.nodes.map((node) => ({
				source: centerNodeId,
				target: node.id,
				isCenterLink: true
			})),
			...graph.edges.map((edge) => ({
				source: edge.source,
				target: edge.target,
				isCenterLink: false
			}))
		];

		const createXForce = () => forceX<GraphNode>((node) => node.targetX).strength(0.18);
		const createYForce = () => forceY<GraphNode>((node) => node.targetY).strength(0.18);

		function updateTargets(selectedMode: ClusterModeId) {
			for (const node of nodes) {
				if (node.kind === 'center' || !node.sourceNode) {
					node.targetX = 0;
					node.targetY = 0;
					node.fx = 0;
					node.fy = 0;
					continue;
				}

				node.targetX = targetX(node.sourceNode, selectedMode);
				node.targetY = targetY(node.sourceNode, selectedMode);
			}

			simulation.force('x', createXForce()).force('y', createYForce());
		}

		function resize() {
			const bounds = graphContainer.getBoundingClientRect();
			width = Math.max(1, bounds.width);
			height = Math.max(1, bounds.height);
			pixelRatio = window.devicePixelRatio || 1;
			graphCanvas.width = Math.floor(width * pixelRatio);
			graphCanvas.height = Math.floor(height * pixelRatio);
			graphCanvas.style.width = `${width}px`;
			graphCanvas.style.height = `${height}px`;
			if (currentMode) {
				updateTargets(currentMode);
			}
			render();
		}

		function resolveNode(node: GraphLink['source']) {
			if (typeof node === 'string') return nodes.find((candidate) => candidate.id === node);
			if (typeof node === 'number') return nodes[node];
			return node;
		}

		function render() {
			graphContext.setTransform(1, 0, 0, 1, 0, 0);
			graphContext.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
			graphContext.setTransform(
				pixelRatio,
				0,
				0,
				pixelRatio,
				width * pixelRatio * 0.5,
				height * pixelRatio * 0.5
			);

			graphContext.lineCap = 'round';
			for (const link of links) {
				const source = resolveNode(link.source);
				const target = resolveNode(link.target);
				if (!source || !target) continue;

				graphContext.beginPath();
				graphContext.moveTo(source.x ?? 0, source.y ?? 0);
				graphContext.lineTo(target.x ?? 0, target.y ?? 0);
				graphContext.strokeStyle = link.isCenterLink
					? 'rgba(255,255,255,0.055)'
					: 'rgba(103,232,249,0.16)';
				graphContext.lineWidth = link.isCenterLink ? 0.7 : 1.2;
				graphContext.stroke();
			}

			for (const node of nodes) {
				const isHovered = hoveredNode?.id === node.id;
				graphContext.beginPath();
				graphContext.arc(
					node.x ?? 0,
					node.y ?? 0,
					isHovered ? node.radius + 3 : node.radius,
					0,
					Math.PI * 2
				);
				graphContext.fillStyle = node.color;
				graphContext.shadowBlur = node.kind === 'center' ? 22 : isHovered ? 18 : 9;
				graphContext.shadowColor = node.color;
				graphContext.fill();
				graphContext.shadowBlur = 0;
				graphContext.strokeStyle =
					node.kind === 'center' ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)';
				graphContext.lineWidth = node.kind === 'center' ? 2 : 1;
				graphContext.stroke();
			}

			drawLabel(nodes[0], 'Calvin', 24, '16px ui-sans-serif, system-ui', 'rgba(255,255,255,0.92)');

			if (hoveredNode && hoveredNode.kind === 'data') {
				drawLabel(
					hoveredNode,
					hoveredNode.title,
					hoveredNode.radius + 14,
					'13px ui-sans-serif, system-ui',
					'rgba(255,255,255,0.86)'
				);
			}
		}

		function drawLabel(
			node: GraphNode,
			label: string,
			offset: number,
			font: string,
			color: string
		) {
			const x = node.x ?? 0;
			const y = node.y ?? 0;
			graphContext.font = font;
			graphContext.textAlign = 'center';
			graphContext.textBaseline = 'middle';
			graphContext.fillStyle = color;
			graphContext.fillText(label, x, y - offset);
		}

		function findNearestNode(event: PointerEvent) {
			const rect = graphCanvas.getBoundingClientRect();
			const x = event.clientX - rect.left - width * 0.5;
			const y = event.clientY - rect.top - height * 0.5;
			let nearest: GraphNode | null = null;
			let nearestDistance = Number.POSITIVE_INFINITY;

			for (const node of nodes) {
				const dx = x - (node.x ?? 0);
				const dy = y - (node.y ?? 0);
				const distance = Math.hypot(dx, dy);
				const hitRadius = Math.max(14, node.radius + 8);
				if (distance <= hitRadius && distance < nearestDistance) {
					nearest = node;
					nearestDistance = distance;
				}
			}

			return nearest;
		}

		function handlePointerMove(event: PointerEvent) {
			const nearest = findNearestNode(event);
			hoveredNode = nearest;
			pointerX = event.clientX;
			pointerY = event.clientY;
			graphCanvas.style.cursor = nearest?.kind === 'data' ? 'pointer' : 'default';
			render();
		}

		function handlePointerLeave() {
			hoveredNode = null;
			graphCanvas.style.cursor = 'default';
			render();
		}

		function handleClick(event: PointerEvent) {
			const nearest = findNearestNode(event);
			if (nearest?.kind === 'data' && nearest.sourceNode) {
				onselect(nearest.sourceNode);
			}
		}

		const simulation = forceSimulation<GraphNode>(nodes)
			.force(
				'link',
				forceLink<GraphNode, GraphLink>(links)
					.id((node) => node.id)
					.distance((link) => (link.isCenterLink ? 112 : 64))
					.strength((link) => (link.isCenterLink ? 0.045 : 0.09))
			)
			.force(
				'charge',
				forceManyBody<GraphNode>().strength((node) => (node.kind === 'center' ? -420 : -72))
			)
			.force('x', createXForce())
			.force('y', createYForce())
			.alpha(0.95)
			.on('tick', () => {
				cancelAnimationFrame(animationFrame);
				animationFrame = requestAnimationFrame(render);
			});

		const runtime: GraphRuntime = {
			render,
			simulation,
			updateTargets
		};
		graphRuntime = runtime;
		untrack(() => resize());

		const resizeObserver = new ResizeObserver(() => {
			resize();
			simulation.alpha(0.55).restart();
		});

		resizeObserver.observe(graphContainer);
		graphCanvas.addEventListener('pointermove', handlePointerMove);
		graphCanvas.addEventListener('pointerleave', handlePointerLeave);
		graphCanvas.addEventListener('click', handleClick);

		return () => {
			cancelAnimationFrame(animationFrame);
			simulation.stop();
			if (graphRuntime === runtime) {
				graphRuntime = null;
			}
			resizeObserver.disconnect();
			graphCanvas.removeEventListener('pointermove', handlePointerMove);
			graphCanvas.removeEventListener('pointerleave', handlePointerLeave);
			graphCanvas.removeEventListener('click', handleClick);
		};
	});

	$effect(() => {
		const selectedMode = mode;
		currentMode = selectedMode;

		untrack(() => {
			graphRuntime?.updateTargets(selectedMode);
			graphRuntime?.render();
			graphRuntime?.simulation.alpha(0.6).restart();
		});
	});

	function openPickerNode() {
		if (pickerNode) {
			onselect(pickerNode);
		}
	}
</script>

<div bind:this={containerElement} class="relative h-full min-h-0 w-full overflow-hidden">
	<canvas
		bind:this={canvasElement}
		class="block h-full w-full"
		aria-label={`Canvas force graph of Calvin's portfolio. Current layout: ${activeModeLabel}.`}
	></canvas>

	<div
		class="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-3 sm:inset-x-6 sm:flex-row sm:items-end sm:justify-between"
	>
		<p
			class="max-w-sm rounded-2xl border border-white/10 bg-black/55 px-4 py-3 text-xs leading-5 text-white/65 shadow-lg shadow-black/30 backdrop-blur"
		>
			Click a portfolio node to open details. The centered Calvin node anchors the full graph and is
			not selectable.
		</p>

		<div
			class="pointer-events-auto rounded-2xl border border-white/10 bg-black/60 p-3 shadow-lg shadow-black/30 backdrop-blur"
		>
			<label class="grid gap-2 text-xs font-medium text-white/70" for="portfolio-node-picker">
				<span>Open item details</span>
				<div class="flex gap-2">
					<select
						id="portfolio-node-picker"
						class="max-w-56 rounded-full border border-white/15 bg-black px-3 py-2 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
						bind:value={pickerNodeId}
					>
						{#each graph.nodes as node (node.id)}
							<option value={node.id}>{node.title}</option>
						{/each}
					</select>
					<button
						type="button"
						class="rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-cyan-100 focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
						onclick={openPickerNode}
					>
						Open
					</button>
				</div>
			</label>
		</div>
	</div>

	{#if hoveredNode?.kind === 'data'}
		<div
			class="pointer-events-none fixed z-40 max-w-xs rounded-xl border border-white/10 bg-zinc-950/90 px-3 py-2 text-sm text-white/85 shadow-xl shadow-black/40 backdrop-blur"
			style:left={`${pointerX + 14}px`}
			style:top={`${pointerY + 14}px`}
		>
			{hoveredNode.title}
		</div>
	{/if}
</div>
