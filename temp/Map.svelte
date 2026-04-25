<script lang="ts">
	import { onMount } from 'svelte';
	import StoryInstance from '$lib/components/visual-module/StoryInstance.svelte';
	import { getLocaleFullName } from '$lib/utils/locale_handler';
	import * as THREE from 'three';
	import { CatmullRomCurve3, Vector3, Vector2, Color, Quaternion, Euler } from 'three';
	import { SimplexNoise } from 'three/examples/jsm/Addons.js';
	import { EffectComposer } from 'threlte-postprocessing';
	import {
		DepthOfFieldEffect,
		BloomEffect,
		VignetteEffect,
		ChromaticAberrationEffect
	} from 'threlte-postprocessing/effects';
	// import { Attractor, Collider, RigidBody, World } from '@threlte/rapier';
	import { T, useTask } from '@threlte/core';
	import {
		interactivity,
		Instance,
		InstancedMesh,
		CameraControls,
		type CameraControlsRef,
		PerfMonitor,
		MeshLineGeometry,
		MeshLineMaterial,
		Text3DGeometry
	} from '@threlte/extras';
	import { FontLoader, type Font } from 'three/addons/loaders/FontLoader.js';
	import { useAudio } from '$lib/composables/useAudio';

	const { playClusterSound } = useAudio();

	// Props
	let {
		data,
		selectedStory = $bindable(),
		isTranslated = $bindable(),
		currentLocale = $bindable(),
		controls = $bindable(),
		onNavigateToStory,
		navigateToClosestStory = $bindable(),
		navigateToFurthestStory = $bindable(),
		navigateToStoryProp = $bindable(),
		findStoryInstanceByStoryIdProp = $bindable()
	}: {
		data: any;
		selectedStory: any;
		isTranslated: boolean;
		currentLocale: string;
		controls: CameraControlsRef;
		onNavigateToStory?: (story: any) => void;
		navigateToClosestStory?: () => void;
		navigateToFurthestStory?: () => void;
		navigateToStoryProp?: (story: any) => void;
		findStoryInstanceByStoryIdProp?: (storyId: string) => StoryInstance | null;
	} = $props();

	// World constants
	const worldScale: number = 25;
	const cameraOffset: number = 10; // Camera offset for selected story
	const centroidCameraOffset: number = 40; // Camera offset for world centroid
	const minZoom: number = 5;
	const maxZoom: number = 100;

	// Cluster constants
	const clusterSpread: number = 5;
	const clusterConnectionThickness: number = 10;
	const clusterConnectionOpacity: number = 0.0075;
	const clusterCurviness: number = 0.25;
	const clusterConnectionRadius: number = 50; // Global radius for cluster connections
	const pointsPerClusterConnection: number = 400;

	// Story constants
	const minStoryGeometrySize: number = 0.15;
	const maxStoryTouchSize: number = 1.25;
	const minStoryScalingFactor: number = 1;
	const minStoryScale: number = 0.01;
	const maxStoryScale: number = 5;
	const curviness: number = 0.35; // Curviness for story connections
	const lineThickness: number = 0.025; // Thickness for story connections
	const pointsPerStoryConnection: number = 100;

	// Character constants
	const maxNumofPointsPerStory = 200;
	const minPointDistancefromStory: number = 0.4;
	const maxPointDistancefromStory: number = 0.65;

	// State
	let centroid = $state(new THREE.Vector3());
	let instances: StoryInstance[] = $state([]);
	let previousSelectedStory: StoryInstance | null = $state(null);
	let clusterCenters: { x: number; y: number; z: number }[] = $state([]);
	let clusterCentersStories: { x: number; y: number; z: number }[] = $state([]);
	let clusterConnectionLines: Vector3[][] = $state([]);

	// Jiggle movement variables
	const storyJiggleIntensity: number = 0.02; // How much stories move
	const jiggleSpeed: number = 0.001; // Speed of the jiggle animation
	const storyJiggleTime: number = 250; // Speed of the jiggle animation
	const charNoiseSpeed: number = 5; // Speed of the char noise animation
	const charNoiseIntensity: number = 10; // Intensity of the char noise animation

	// Colours
	const clusterConnectionColor: string = '#1457ff';
	const storyConnectionColor: string = 'white';

	// Curve animation variables
	const curveSpeed: number = 80; // Speed of curve animation
	const curveNoiseIntensity: number = 0.05; // Intensity of noise variation

	// Pulse animation variables
	const pulseFrequencyMin: number = 0.5; // Minimum pulse frequency multiplier
	const pulseFrequencyMax: number = 0.525; // Maximum pulse frequency multiplier
	const pulseIntensityMin: number = 0.075; // Minimum pulse intensity (scale change)
	const pulseIntensityMax: number = 0.1; // Maximum pulse intensity (scale change)

	// Time variables
	let noise = new SimplexNoise();
	let time = $state(0);
	let sphereTime = $state(0); // Separate time for sphere animation

	// Character Rotation adjustment
	let rotYOffset = $state(Math.PI); // animatedTheta - Math.PI / 2
	let rotXOffset = $state(0); // animatedPhi
	let rotZOffset = $state(0);

	// Character font
	const loader = new FontLoader();
	let loadedFont = $state<Font | null>(null);
	const font = loader.load('/Roboto_Thin_Regular_Latin.json', (font) => {
		loadedFont = font;
	});

	// Interactivity
	interactivity({
		filter(items) {
			// only report the first intersection
			return items.slice(0, 1);
		}
	});

	// Function to map text length to a range from 1 to 5
	function mapTextLengthToRange(textLength: number): number {
		// Define the expected range of text lengths (you may need to adjust these based on your data)
		const minRange = minStoryScale;
		const maxRange = maxStoryScale;
		const minTextLength = 0;
		const maxTextLength = maxNumofPointsPerStory; // Adjust this based on your typical text lengths

		// If textLength is larger than maxTextLength, return the maxRange
		if (textLength > maxTextLength) {
			return maxRange;
		}

		// Clamp the text length to the expected range (only clamp the lower bound)
		const clampedLength = Math.max(minTextLength, textLength);

		// Map from [minTextLength, maxTextLength] to [minRange, maxRange]
		const mappedLength =
			minRange +
			((clampedLength - minTextLength) / (maxTextLength - minTextLength)) * (maxRange - minRange);

		return mappedLength;
	}

	// Function to create character instances from input text
	function createTextInstances(inputText: string, scale: number, storyPosition: Vector3) {
		const textInstances: any[] = [];

		// Convert text to array of characters
		const characters = inputText.split('');

		// Define spherical distribution parameters
		const minRadius = scale * minPointDistancefromStory; // Minimum distance from story center
		const maxRadius = scale * maxPointDistancefromStory; // Maximum distance from story center

		// Create an instance for each character with spherical distribution
		characters.forEach((char, index) => {
			// Generate random spherical coordinates
			const radius = minRadius + Math.random() * (maxRadius - minRadius);
			const theta = Math.random() * Math.PI * 2; // Azimuthal angle (0 to 2π)
			const phi = Math.acos(2 * Math.random() - 1); // Polar angle (0 to π) - uniform distribution

			// Convert spherical to cartesian coordinates
			const x = radius * Math.sin(phi) * Math.cos(theta);
			const y = radius * Math.sin(phi) * Math.sin(theta);
			const z = radius * Math.cos(phi);

			textInstances.push({
				position: new Vector3(storyPosition.x + x, storyPosition.y + y, storyPosition.z + z),
				char: char,
				// Store original spherical coordinates for orbital animation
				originalSpherical: {
					radius: radius,
					theta: theta,
					phi: phi,
					centerX: storyPosition.x,
					centerY: storyPosition.y,
					centerZ: storyPosition.z
				}
			});
		});

		return textInstances;
	}

	function populateFromData() {
		if (!data || !data.clusters) return;

		// Clear existing instances to avoid duplicates
		instances.length = 0;
		clusterCenters.length = 0;
		clusterCentersStories.length = 0;
		clusterConnectionLines.length = 0;

		for (let i = 0; i < data.clusters.length; i += 1) {
			const cluster = data.clusters[i];
			const cluster_audio_id = '';
			const clusterCenter = data.clusters[i].som;
			const clusterSphereResolution = [
				Math.floor(Math.random() * 7) + 3,
				Math.floor(Math.random() * 8) + 2
			];

			// console.log(clusterSphereResolution);

			// Add cluster center to the array
			clusterCenters.push({
				x: clusterCenter[0] * worldScale,
				y: clusterCenter[1] * worldScale,
				z: clusterCenter[2] * worldScale
			});
			// Filter stories based on isTranslated flag and current language
			let filteredStories = cluster.stories;
			let _isTranslated = isTranslated;
			let _culocale = currentLocale;
			console.log('isTranslated:', _isTranslated, 'currentLocale:', _culocale);

			if (isTranslated) {
				const currentLanguage = getLocaleFullName();
				filteredStories = cluster.stories.filter((story: any) => {
					// Check if any story in the array matches the current language
					return story.some((storyVariant: any) => storyVariant?.language === currentLanguage);
				});

				// If we have matching stories, filter each story to only include the matching language variant
				if (filteredStories.length > 0) {
					filteredStories = filteredStories.map((story: any) => {
						const matchingVariant = story.find(
							(storyVariant: any) => storyVariant?.language === currentLanguage
						);
						return matchingVariant ? [matchingVariant] : story;
					});
				}
			}

			// Filter out any stories that don't have valid coordinates in the first element
			filteredStories = filteredStories.filter((story: any) => {
				return story && story.length > 0 && story[0] && story[0].coordinates;
			});

			// Get the color of the cluster
			const initialColor = new Color(Math.random(), Math.random(), Math.random());
			const selectedColor = new Color('white');

			// Generate random offsets for each story (to be reused consistently)
			const storyOffsets: { x: number; y: number; z: number }[] = [];
			for (let j = 0; j < filteredStories.length; j += 1) {
				storyOffsets.push({
					x: (Math.random() - 0.5) * clusterSpread,
					y: (Math.random() - 0.5) * clusterSpread,
					z: (Math.random() - 0.5) * clusterSpread
				});
			}
			// Only create curves if there are multiple stories in the cluster
			let allStoryPositions: Vector3[] = [];
			if (filteredStories.length > 1) {
				// Collect all story positions in this cluster WITH the same random offsets
				for (let j = 0; j < filteredStories.length; j += 1) {
					const story = filteredStories[j];
					const offset = storyOffsets[j];

					const storyPos = new Vector3(
						story[0].coordinates[0] * worldScale + offset.x,
						story[0].coordinates[1] * worldScale + offset.y,
						story[0].coordinates[2] * worldScale + offset.z
					);
					allStoryPositions.push(storyPos);
				}
			}

			// Calculate the center of all stories in this cluster (after offsets)
			if (allStoryPositions.length > 0) {
				const storyCenter = new Vector3();
				allStoryPositions.forEach((pos) => {
					storyCenter.add(pos);
				});
				storyCenter.divideScalar(allStoryPositions.length);

				clusterCentersStories.push({
					x: storyCenter.x,
					y: storyCenter.y,
					z: storyCenter.z
				});
			}

			for (let j = 0; j < filteredStories.length; j += 1) {
				const story = filteredStories[j];
				const text_length = story[0].text.length;
				const scale = minStoryScalingFactor + mapTextLengthToRange(text_length);
				const cluster_id = cluster.text;
				const storyObject = story;

				// Use the same offset that was generated earlier for this story
				const offset = storyOffsets[j];

				// Get coordinates from the first variant of the story
				let story_positions = {
					x: story[0].coordinates[0] * worldScale + offset.x,
					y: story[0].coordinates[1] * worldScale + offset.y,
					z: story[0].coordinates[2] * worldScale + offset.z
				};
				let story_velocities = {
					vx: (Math.random() - 0.5) * 0.1,
					vy: (Math.random() - 0.5) * 0.1,
					vz: (Math.random() - 0.5) * 0.1
				};

				// Cap the story text to 200 characters

				const cappedText =
					story[0].text.length > maxNumofPointsPerStory
						? story[0].text.substring(0, maxNumofPointsPerStory) + '...'
						: story[0].text;

				let text_instances = createTextInstances(
					cappedText,
					scale,
					new Vector3(story_positions.x, story_positions.y, story_positions.z)
				);

				// Create pairs: each story connects to every other story individually
				let storyPairCurves: Vector3[][] = [];
				if (allStoryPositions.length > 1) {
					// Current story position
					const currentStoryPos = new Vector3(
						story_positions.x,
						story_positions.y,
						story_positions.z
					);

					// Create a separate curve for each pair (current story to each other story in the same cluster)
					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							// Skip the current story's position
							// Create pair: [current story, other story]
							const startPos = currentStoryPos;
							const endPos = allStoryPositions[k];

							// Calculate distance between the two points
							const distance = startPos.distanceTo(endPos);
							const offsetAmount = distance * curviness; // Initial curviness

							// Create midpoint at 50% between the two points
							const midPoint = startPos.clone().lerp(endPos, 0.5);

							// Randomly choose x, y, or z axis for offset and direction (up/down)
							const randomAxis = Math.floor(Math.random() * 3);
							const randomDirection = Math.random() < 0.5 ? -1 : 1;

							// Apply offset to the chosen axis
							switch (randomAxis) {
								case 0:
									midPoint.x += offsetAmount * randomDirection;
									break;
								case 1:
									midPoint.y += offsetAmount * randomDirection;
									break;
								case 2:
									midPoint.z += offsetAmount * randomDirection;
									break;
							}

							// Create curve with the offset midpoint
							const pairPositions = [startPos, midPoint, endPos];
							const pairCurve = new CatmullRomCurve3(pairPositions);
							const pairPoints = pairCurve.getPoints(pointsPerStoryConnection);
							storyPairCurves.push(pairPoints);
						}
					}
				}

				// Create the instance first
				const newInstance = new StoryInstance(
					initialColor,
					selectedColor,
					scale,
					cluster_id,
					cluster_audio_id,
					storyObject,
					text_length,
					text_instances,
					clusterSphereResolution,
					storyPairCurves, // Pass the array of pair curves
					story_positions,
					story_velocities
				);

				// Store curve metadata for animation
				newInstance.curveMetadata = [];
				if (allStoryPositions.length > 1) {
					const currentStoryPos = new Vector3(
						story_positions.x,
						story_positions.y,
						story_positions.z
					);

					for (let k = 0; k < allStoryPositions.length; k += 1) {
						if (k !== j) {
							const startPos = currentStoryPos;
							const endPos = allStoryPositions[k];
							const distance = startPos.distanceTo(endPos);
							const randomAxis = Math.floor(Math.random() * 3);
							const randomDirection = Math.random() < 0.5 ? -1 : 1;

							newInstance.curveMetadata.push({
								startPos: startPos,
								endPos: endPos,
								randomAxis: randomAxis,
								direction: randomDirection,
								distance: distance
							});
						}
					}
				}

				instances.push(newInstance);
			}
		}

		// Create connection lines between story centers (green cubes) within radius
		for (let i = 0; i < clusterCentersStories.length; i += 1) {
			for (let j = i + 1; j < clusterCentersStories.length; j += 1) {
				const startPos = new Vector3(
					clusterCentersStories[i].x,
					clusterCentersStories[i].y,
					clusterCentersStories[i].z
				);
				const endPos = new Vector3(
					clusterCentersStories[j].x,
					clusterCentersStories[j].y,
					clusterCentersStories[j].z
				);

				// Calculate distance between the two cluster centers
				const distance = startPos.distanceTo(endPos);

				// Only create connection if clusters are within the specified radius
				if (distance <= clusterConnectionRadius) {
					const offsetAmount = distance * clusterCurviness;

					// Create midpoint at 50% between the two points
					const midPoint = startPos.clone().lerp(endPos, 0.5);

					// Randomly choose x, y, or z axis for offset and direction (up/down)
					const randomAxis = Math.floor(Math.random() * 3);
					const randomDirection = Math.random() < 0.5 ? -1 : 1;

					// Apply offset to the chosen axis
					switch (randomAxis) {
						case 0:
							midPoint.x += offsetAmount * randomDirection;
							break;
						case 1:
							midPoint.y += offsetAmount * randomDirection;
							break;
						case 2:
							midPoint.z += offsetAmount * randomDirection;
							break;
					}

					// Create curve with the offset midpoint
					const pairPositions = [startPos, midPoint, endPos];
					const pairCurve = new CatmullRomCurve3(pairPositions);
					const pairPoints = pairCurve.getPoints(pointsPerClusterConnection);
					clusterConnectionLines.push(pairPoints);
				}
			}
		}

		centroid = calculateCentroid();
		lookAtCentroid();
	}

	// Calculate centroid
	function calculateCentroid() {
		const centroidValue = new THREE.Vector3();
		for (let i = 0; i < instances.length; i++) {
			centroidValue.add(instances[i].positions);
		}
		centroidValue.divideScalar(instances.length);
		return centroidValue;
	}

	// Look at centroid
	function lookAtCentroid() {
		controls?.setLookAt(
			centroid.x,
			centroid.y,
			centroid.z + centroidCameraOffset,
			centroid.x,
			centroid.y,
			centroid.z,
			true
		);
	}

	// Navigate to closest story
	function navigateToClosest() {
		console.log('Navigating to closest story');
		if (selectedStory && selectedStory.closestStory) {
			console.log('Calling navigateToClosestStory function');
			navigateToStory(selectedStory.closestStory);
		} else {
			console.log(
				'navigateToClosestStory function is undefined or selectedStory.closestStory is undefined'
			);
		}
	}

	// Navigate to furthest story
	function navigateToFurthest() {
		console.log('Navigating to furthest story');
		if (selectedStory && selectedStory.furthestStory) {
			console.log('Calling navigateToFurthestStory function');
			navigateToStory(selectedStory.furthestStory);
		}
	}

	// Navigate to a specific story with camera transition
	function navigateToStory(targetStory: any) {
		console.log('In navigateToStory function');
		if (!targetStory || !controls) return;

		// Reset all instances' selected state
		instances.forEach((inst) => (inst.selected = false));

		// Set target story as selected
		targetStory.selected = true;
		targetStory.tw.set(1);

		// Calculate distances for the new selected story
		targetStory.calculateNearestAndFurthest(instances);

		// Move camera to target story with smooth transition
		controls.setLookAt(
			targetStory.positions.x,
			targetStory.positions.y,
			targetStory.positions.z + cameraOffset,
			targetStory.positions.x,
			targetStory.positions.y,
			targetStory.positions.z,
			true
		);

		// Update selected story (this will trigger modal to update)
		selectedStory = targetStory;

		// Call external navigation callback if provided
		if (onNavigateToStory) {
			onNavigateToStory(targetStory);
		}
	}

	function setZoom() {
		controls.minDistance = minZoom;
		controls.maxDistance = maxZoom;
	}

	// Effect to handle modal closing - show points for previous story
	$effect(() => {
		if (selectedStory === null) {
			// Modal closed, show points for the previous selected story
			if (previousSelectedStory) {
				previousSelectedStory.selected = true;
				previousSelectedStory.tw.set(1);
			}
			// Note: Pulsing remains active even after modal closes
		}
	});

	onMount(() => {
		// Preload sound effects for better performance
		populateFromData();
		setZoom();
	});

	// Function to find StoryInstance by story ID
	function findStoryInstanceByStoryId(storyId: string): StoryInstance | null {
		for (const instance of instances) {
			// Check if any story in the instance's story array has the matching ID
			for (const storyElement of instance.story) {
				if (storyElement?.id === storyId) {
					return instance;
				}
			}
		}
		return null;
	}

	// Bind navigation functions to be accessible from parent
	navigateToClosestStory = navigateToClosest;
	navigateToFurthestStory = navigateToFurthest;
	navigateToStoryProp = navigateToStory;
	findStoryInstanceByStoryIdProp = findStoryInstanceByStoryId;

	// Animation loop for jiggle movement and curve animation
	useTask((delta) => {
		time += delta * jiggleSpeed;
		sphereTime += delta; // Update sphere animation time

		// Update story positions with SimplexNoise jiggle
		instances.forEach((instance, index) => {
			// Update pulse animation
			instance.updatePulse(delta);

			// Use different noise seeds for each instance and axis
			const noiseOffsetX =
				noise.noise3d(index * 100, time * storyJiggleTime, 0) * storyJiggleIntensity;
			const noiseOffsetY =
				noise.noise3d(index * 100, time * storyJiggleTime, 100) * storyJiggleIntensity;
			const noiseOffsetZ =
				noise.noise3d(index * 100, time * storyJiggleTime, 200) * storyJiggleIntensity;

			// Store original positions if not already stored
			if (!instance.originalPositions) {
				instance.originalPositions = {
					x: instance.positions.x,
					y: instance.positions.y,
					z: instance.positions.z
				};
			}

			// Apply jiggle to positions
			instance.positions.x = instance.originalPositions.x + noiseOffsetX;
			instance.positions.y = instance.originalPositions.y + noiseOffsetY;
			instance.positions.z = instance.originalPositions.z + noiseOffsetZ;

			// Update curves with time-based curviness
			if (instance.curveMetadata && instance.curveMetadata.length > 0) {
				let storyPairCurves: Vector3[][] = [];

				// Update each curve using stored metadata
				instance.curveMetadata.forEach((metadata, curveIndex) => {
					const startPos = new Vector3(
						instance.positions.x,
						instance.positions.y,
						instance.positions.z
					);
					const endPos = metadata.endPos;

					// Calculate distance between the two points
					const distance = startPos.distanceTo(endPos);

					// Time-based curviness with sine function and noise
					const baseCurviness = curviness;
					const timeCurviness = Math.sin(time * curveSpeed + index * 100) * baseCurviness;
					const noiseCurviness =
						noise.noise3d(index * 50, curveIndex * 50, time * curveSpeed) * curveNoiseIntensity;
					const dynamicCurviness = timeCurviness + noiseCurviness;

					const offsetAmount = distance * dynamicCurviness;

					// Create midpoint at 50% between the two points
					const midPoint = startPos.clone().lerp(endPos, 0.5);

					// Apply offset to the stored axis and direction
					switch (metadata.randomAxis) {
						case 0:
							midPoint.x += offsetAmount * metadata.direction;
							break;
						case 1:
							midPoint.y += offsetAmount * metadata.direction;
							break;
						case 2:
							midPoint.z += offsetAmount * metadata.direction;
							break;
					}

					// Create curve with the updated midpoint
					const pairPositions = [startPos, midPoint, endPos];
					const pairCurve = new CatmullRomCurve3(pairPositions);
					const pairPoints = pairCurve.getPoints(100);
					storyPairCurves.push(pairPoints);
				});

				// Update the instance's curves
				instance.curve = storyPairCurves;
			}
		});
	});
</script>

<T.PerspectiveCamera makeDefault position={[10, 0, 0]}>
	<CameraControls bind:ref={controls} />
</T.PerspectiveCamera>

<!-- <PerfMonitor anchorY="bottom" /> -->

<!-- Centroid -->
<!-- <T.Mesh position={[centroid.x, centroid.y, centroid.z]}>
	<T.BoxGeometry />
	<T.MeshBasicMaterial color="red" />
</T.Mesh> -->

<!-- Cluster Centers -->
<!-- {#each clusterCenters as center}
	<T.Mesh position={[center.x, center.y, center.z]}>
		<T.BoxGeometry />
		<T.MeshBasicMaterial color="red" />
	</T.Mesh>
{/each} -->

<!-- Story Centers -->
<!-- {#each clusterCentersStories as center}
	<T.Mesh position={[center.x, center.y, center.z]}>
		<T.SphereGeometry args={[10, 16, 16]} />
		<T.MeshBasicMaterial color={clusterConnectionColor} transparent={true} opacity={0.005} />
	</T.Mesh>
{/each} -->

<EffectComposer>
	<DepthOfFieldEffect focusDistance={0} focalLength={0.125} bokehScale={6} height={512} />
	<BloomEffect
		luminanceThreshold={0.5}
		luminanceSmoothing={0.4}
		height={256}
		radius={0.65}
		intensity={4}
	/>
	<VignetteEffect eskil={false} offset={0.05} darkness={1.1} />
	<ChromaticAberrationEffect
		offset={new Vector2(0.001, 0.001)}
		radialModulation={false}
		modulationOffset={0.15}
	/>

	<!-- Cluster Connection Lines -->
	{#each clusterConnectionLines as linePoints}
		<T.Mesh>
			<MeshLineGeometry points={linePoints} />
			<MeshLineMaterial
				color={clusterConnectionColor}
				width={clusterConnectionThickness}
				opacity={clusterConnectionOpacity}
				transparent={true}
			/>
		</T.Mesh>
	{/each}

	<!-- Story target sphere -->
	<InstancedMesh>
		<T.SphereGeometry args={[maxStoryTouchSize, 8, 8]} />
		<T.MeshBasicMaterial color="white" toneMapped={false} transparent={true} opacity={0} />
		{#each instances as instance}
			<Instance
				position.y={instance.positions.y}
				position.x={instance.positions.x}
				position.z={instance.positions.z}
				onclick={() => {
					// Store the previous selected story before changing
					if (selectedStory) {
						previousSelectedStory = selectedStory;
					}

					// Stop pulsing for all instances first
					instances.forEach((inst) => {
						inst.stopPulsing();
					});

					// Reset all other instances' selected state (including previous story)
					instances.forEach((inst) => {
						inst.selected = false;
						inst.tw.set(0);
					});

					// Set this instance as selected and keep it highlighted
					instance.selected = true;
					instance.tw.set(1);

					// Start pulsing for all stories in the same cluster with unique parameters
					instances.forEach((inst, index) => {
						if (inst.cluster_id === instance.cluster_id && inst !== instance) {
							// Configure unique pulse parameters for each story using global ranges
							const frequency =
								pulseFrequencyMin + Math.random() * (pulseFrequencyMax - pulseFrequencyMin);
							const intensity =
								pulseIntensityMin + Math.random() * (pulseIntensityMax - pulseIntensityMin);
							const phase = Math.random() * Math.PI * 2; // 0 to 2π

							inst.configurePulse(frequency, intensity, phase);
							inst.startPulsing();
						}
					});

					// Calculate nearest and furthest stories for navigation
					instance.calculateNearestAndFurthest(instances);

					selectedStory = instance;
					// Play sound for the story
					playClusterSound();

					// Center camera on the selected story
					if (controls) {
						// Move camera to look at the story with smooth transition
						controls.setLookAt(
							instance.positions.x,
							instance.positions.y,
							instance.positions.z + cameraOffset, // Camera position (offset from story)
							instance.positions.x,
							instance.positions.y,
							instance.positions.z, // Look at the story position
							true // Enable smooth transition
						);
					}
				}}
				onpointerenter={() => {
					// Only animate if not selected
					if (!instance.selected) {
						instance.tw.set(1);
					}
				}}
				onpointerleave={() => {
					// Only reset if not selected
					if (!instance.selected) {
						instance.tw.set(0);
					}
				}}
			/>
		{/each}
	</InstancedMesh>

	<!-- Story geometry -->
	<InstancedMesh>
		<T.SphereGeometry args={[minStoryGeometrySize, 3, 2]} />
		<T.MeshBasicMaterial color="white" toneMapped={false} />
		{#each instances as instance}
			<Instance
				position.y={instance.positions.y}
				position.x={instance.positions.x}
				position.z={instance.positions.z}
				scale={instance.scale}
				onpointerenter={() => {
					// Only animate if not selected
					if (!instance.selected) {
						instance.tw.set(1);
					}
				}}
				onpointerleave={() => {
					// Only reset if not selected
					if (!instance.selected) {
						instance.tw.set(0);
					}
				}}
			/>

			{#if instance.curve && instance.curve.length > 0 && instance.tw.current > 0}
				{#each instance.curve as pairCurvePoints}
					<T.Mesh>
						<MeshLineGeometry points={pairCurvePoints} />
						<MeshLineMaterial color={storyConnectionColor} width={lineThickness} />
					</T.Mesh>
				{/each}
			{/if}

			{#if instance.text_instances && instance.text_instances.length > 0 && instance.selected}
				{#each instance.text_instances as character, index}
					{@const { animatedX, animatedY, animatedZ, rotationX, rotationY, rotationZ } = (() => {
						// Animate the spherical angles using noise for orbital motion
						const thetaOffset =
							noise.noise3d(index * 200, time * charNoiseSpeed, 300) * charNoiseIntensity; // Reduced intensity for smoother orbital motion
						const phiOffset =
							noise.noise3d(index * 200, time * charNoiseSpeed, 400) * charNoiseIntensity; // Slightly less phi movement for more natural motion

						// Calculate animated spherical coordinates
						const animatedTheta = character.originalSpherical.theta + thetaOffset;
						const animatedPhi = character.originalSpherical.phi + phiOffset;
						const radius = character.originalSpherical.radius; // Keep radius constant

						// Convert animated spherical coordinates back to cartesian
						const x = radius * Math.sin(animatedPhi) * Math.cos(animatedTheta);
						const y = radius * Math.sin(animatedPhi) * Math.sin(animatedTheta);
						const z = radius * Math.cos(animatedPhi);

						const worldX = character.originalSpherical.centerX + x;
						const worldY = character.originalSpherical.centerY + y;
						const worldZ = character.originalSpherical.centerZ + z;

						// Use Three.js Quaternion for proper "look at" rotation
						const characterPos = new Vector3(worldX, worldY, worldZ);
						const centerPos = new Vector3(
							character.originalSpherical.centerX,
							character.originalSpherical.centerY,
							character.originalSpherical.centerZ
						);

						// Create a quaternion that makes the character look at the center
						const lookAtMatrix = new THREE.Matrix4();
						lookAtMatrix.lookAt(characterPos, centerPos, new Vector3(0, 1, 0));
						const lookAtQuaternion = new Quaternion();
						lookAtQuaternion.setFromRotationMatrix(lookAtMatrix);

						// Convert quaternion to Euler angles and apply slider offsets
						const euler = new Euler();
						euler.setFromQuaternion(lookAtQuaternion, 'XYZ');
						const rotX = euler.x + rotXOffset;
						const rotY = euler.y + rotYOffset + Math.PI;
						const rotZ = euler.z + rotZOffset;

						return {
							animatedX: worldX,
							animatedY: worldY,
							animatedZ: worldZ,
							rotationX: rotX,
							rotationY: rotY,
							rotationZ: rotZ
						};
					})()}
					{#if loadedFont}
						<T.Mesh
							position={[animatedX, animatedY, animatedZ]}
							rotation={[rotationX, rotationY, rotationZ]}
						>
							<Text3DGeometry
								font={loadedFont}
								text={character.char}
								size={0.125}
								depth={0.01}
								curveSegments={1}
								bevelThickness={0}
								bevelSize={0}
								bevelSegments={1}
								bevelEnabled={true}
								smooth={0}
							/>
							<T.MeshBasicMaterial color="white" toneMapped={false} />
						</T.Mesh>
					{/if}
				{/each}
			{/if}
		{/each}
	</InstancedMesh>
</EffectComposer>