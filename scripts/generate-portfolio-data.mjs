/**
 * One-shot generator: writes src/lib/data/data.json and project markdown files.
 * Run: node scripts/generate-portfolio-data.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

/** @type {Array<{title: string, year: string, url: string, location: string, description: string, content: string}>} */
const projects = [
	{
		title: 'Kotimaan Teknokatsaus XVI',
		year: '2026',
		url: 'kotimaan-teknokatsaus-xvi',
		location: 'Finland',
		description:
			'Participation in the 2026 edition of Kotimaan Teknokatsaus, a recurring review of technology culture and practice in Finland.',
		content: `# Kotimaan Teknokatsaus XVI

*2026 | Finland*

Participation in the 2026 edition of the Kotimaan Teknokatsaus (Finnish domestic technology review), a recurring series reviewing technology culture and practice in Finland.
`
	},
	{
		title: 'Healing',
		year: '2025',
		url: 'healing',
		location: 'Helsinki, Finland',
		description:
			'Approximately twenty pen-plotter prints on ink and paper — a personal reset through making after a tumultuous year.',
		content: `# Healing

*2025 | Helsinki, Finland*
*Ink on paper (pen plotter), 29.7 × 42.0 cm*

After a tumultuous end to 2025, returned to basics and made approximately twenty prints on the modified pen plotter. A personal reset through making — the prints range across subjects: animals, violence, generative abstract art, and portraits. A return to the directness and intimacy of the plotter as a medium for processing experience.

*Medium: Pen plotter (Ender 3 with custom adapter), generative algorithms, ink on paper.*
`
	},
	{
		title: 'Rauhankone — Ekho Collective',
		year: '2025',
		url: 'rauhankone',
		location: 'Helsinki / Oulu, Finland',
		description:
			'Immersive multidisciplinary media installation exploring peace as a dynamic process, produced for Oulu European Capital of Culture 2026.',
		content: `# Rauhankone — Ekho Collective

*2024–2025 | Helsinki / Oulu, Finland*
*Interactive immersive installation | Oulu European Capital of Culture 2026*

*Layers in The Peace Machine* is an immersive and multidisciplinary media installation entangling technology and art. Based on the literary work *Peace Machine* (*Rauhankone*) by the late Timo Honkela, the installation portrays peace as a dynamic process that shifts and evolves with the interaction of participants. The work explores how technology and collective presence can make abstract ideas — like peace — tangible and experiential.

Produced as part of the programme for **Oulu European Capital of Culture 2026** by the Finnish **Ekho Collective**: a group of artists, designers, and technology professionals specialising in immersive experiences. Members: Calvin Guillot, Essi Huotari, Vertti Luostarinen, Saara-Henriikka Mäkinen, Sini Parikka, Ilmari Pesonen, Olivia Pohjola, Iina Taijonlahti, and Timo Tikka.

*Technologies: Interactive installation, immersive media systems, real-time interactive environments, sensor-based interaction.*
`
	},
	{
		title: 'Unframed Ticas Residency',
		year: '2025',
		url: 'unframed-ticas',
		location: 'Tartu, Estonia / Tampere, Finland',
		description:
			'AR mobile experience porting Carlosverse identity portraits into physical space, developed during a mini-residency in Tartu.',
		content: `# Unframed Ticas Residency

*2025 | Tartu, Estonia / Tampere, Finland*
*AR mobile experience*

*Unframed: AR for Artmakers* is a collaboration between Culture Cooperative TIcAS (Finland) and contemporary art platform De Structura (Estonia). Participated in the mini-residency in Tartu, Estonia, exploring how augmented reality (AR) can be used by artists to both create and present their work — highlighting the technology's potential to expand artistic practices and open new creative possibilities.

The project was a port of the Carlosverse piece into an AR mobile experience, bringing the AI-generated identity portraits into physical space via mobile devices. The exhibition was subsequently showcased in Tampere, Finland as part of **Tampere Architecture and Design Week 2025**.

*Technologies: Augmented Reality (AR), mobile development, Stable Diffusion (Carlosverse model).*
`
	},
	{
		title: 'Consumed — Art for All Festival',
		year: '2025',
		url: 'consumed',
		location: 'Itäkeskus, Helsinki, Finland',
		description:
			'Video installation exploring unrestricted consumption through simulated geometry amalgamated with aerial photography of Eastern Helsinki shopping centres.',
		content: `# Consumed — Art for All Festival

*2025 | Itäkeskus, Helsinki, Finland*
*Single-channel video, 2 × 1 m*

Video installation for the Art For All Festival 2025 at the Easton Hansakäytävä shopping centre, on the theme of *Success & Glory* — exploring money, consumerism, and what success means in contemporary society. The piece presents a bird's-eye view of the unstoppable growth of shopping centres around Eastern Helsinki, with simulated geometry amalgamated with real aerial photography and geospatial map data. Asks: how much more will we build before it is enough?

Many problems in our modern world can be attributed to a single root: unrestricted consumption, encouraged and fundamentally necessary for the current form of capitalism. The shopping mall is a symbol of wasteful city planning, where new venues, metro stations, and residential areas catalyse the emergence of shopping malls even adjacent to existing ones.

*Technologies: 3D simulation, geospatial data visualisation, digital compositing, aerial photography integration.*
*Photos: Konsta Klemetti and Siavash Minaravesh.*
`
	},
	{
		title: 'Outsider / Carlosverse — Outsider Art Festival 2025',
		year: '2025',
		url: 'outsider-carlosverse',
		location: 'Helsinki, Finland',
		description:
			'10-minute video installation of hundreds of AI-generated Carlos variations with synthesised voice, presented at Outsider Art Festival 2025.',
		content: `# Outsider / Carlosverse — Outsider Art Festival 2025

*2025 | Helsinki, Finland*
*Single-channel video, 2 × 1 m*

Digital continuation of the Carlosverse series. A 10-minute video installation featuring hundreds of AI-generated variations of "Carlos", accompanied by a synthesised voice of Carlos saying random things. Presented at the **Outsider Art Festival 2025** — an event that invites everyone to celebrate equality by giving voice to outsider artists through music, visual arts, performing arts, films, literature, and life stories. Attended by thousands of visitors. The audience was as always curious about who this mysterious yet familiar man could be.

Raises questions about identity, individuality, ownership, synthetic humans, and the definition of humanity in a world where hundreds of thousands of variations of a person's image can be effortlessly generated.

*Technologies: Stable Diffusion (custom LoRA/Dreambooth model), ElevenLabs voice synthesis, video composition.*
`
	},
	{
		title: 'Computer Vision — Expo 2025 Osaka',
		year: '2025',
		url: 'computer-vision-expo',
		location: 'Osaka, Japan',
		description:
			'Short film on the gap between lived experience and digitisation, projected at 25 × 8 m for Expo 2025 Shining Hat opening in Osaka.',
		content: `# Computer Vision — Expo 2025 Osaka

*2025 | Osaka, Japan*
*Single-channel video, 25 × 8 m projection*

Short film exploring the gap between embodied lived experience and its digitisation — a process increasingly shaping how humans and machines perceive reality. Showcases different aesthetics and imaginations of how computers interpret our world. Presented at the **Expo 2025 Shining Hat** Expo Hall opening screening event in Osaka, Japan — a landmark venue for Expo 2025 Osaka Kansai hosting the opening and closing ceremonies. The hall is named "Shining Hat" for its brilliant golden disk atop a sturdy cylindrical base — evoking a parabolic antenna as a symbol of sharing and receiving of information, its golden-shimmering roof reminiscent of the Tower of the Sun from Japan World Exposition Osaka 1970. The amphitheater, wrapped in textured pure white fabric, symbolises "a bright future for our lives."

*Technologies: Stable Diffusion, generative visuals, 3D rendering, large-scale projection (Outer Wall surface of EXPO Hall).*
*Collaboration: Margo Nowicka (visuals), Wild Perra (sound).*
*Grant: Frame Contemporary Art Finland.*
`
	},
	{
		title: 'Kraftlaus — SÍM Residency, Reykjavik',
		year: '2025',
		url: 'kraftlaus',
		location: 'Korpúlfsstaðir, Reykjavik, Iceland',
		description:
			'Site-specific audiovisual interactive installation exploring the relationship between humans and glaciers, produced during a 2-month SÍM residency.',
		content: `# Kraftlaus — SÍM Residency, Reykjavik

*2025 | Korpúlfsstaðir, Reykjavik, Iceland*
*Audiovisual ALife interactive installation*

Site-specific audiovisual interactive installation produced during a 2-month residency at Sambands íslenskra myndlistarmanna (SÍM) in Reykjavik. The title means "powerless" in Icelandic. The work explores the relationship between humans and glaciers — their death and rebirth, the microscopic beings trapped within them, ash falls, human dissection and analysis, and ultimately the glacier's powerlessness to resist human impact.

The installation features a large HD screen floating in the middle of a space, with a camera mounted on top tracking participant movements and gestures. Headphones deliver intimate synthesised guttural sounds. By performing certain actions, participants trigger different stories — from serene ice landscapes to fast-flashing imagery — embodying the experience of being a glacier.

*Technologies: Motion tracking / computer vision (OpenCV / camera), real-time audio synthesis, TouchDesigner, interactive systems, HD display.*
*Funded by: Nordic-Baltic Mobility Programme for Culture (Nordic Culture Point). Curated by Sunna Dagsdóttir. Directed by Martynas Petreikis.*
`
	},
	{
		title: 'Off the Wall — Aavistus Festival',
		year: '2024',
		url: 'off-the-wall',
		location: 'Helsinki, Finland',
		description:
			'Large-scale audiovisual screening programme for Aavistus Festival 2024, curated and produced with generative visual identity.',
		content: `# Off the Wall — Aavistus Festival

*October 2024 | Helsinki, Finland*
*Large-scale projection screening, 5 × 12 m*

Audiovisual exhibition screening presented as special programming for Aavistus Festival 2024. Curated works by 10+ international new media artists exploring longer-format screened audiovisual pieces under the theme "at the points of interconnections". Managed multiple stakeholders: museum venues, artists, production company, equipment, and overall integration into the larger festival.

Roles: Curator, AV technician, director, producer. Also created the generative simulations used for the screening's visual identity.

*Technologies: AV production, projection systems, generative simulations (TouchDesigner/p5.js), event management.*
*More: [aavistusoffthewall.cargo.site](https://aavistusoffthewall.cargo.site/)*
`
	},
	{
		title: 'Telar — Aalto University Väre',
		year: '2024',
		url: 'telar',
		location: 'Espoo, Finland',
		description:
			'Site-specific paper sculpture installation of receipt strips hung between building wings, with density controlled by noise functions.',
		content: `# Telar — Aalto University Väre

*2024 | Espoo, Finland (9 months in production)*
*Paper sculpture / installation, 12 × 20 m*

Site-specific installation at the media area kitchen in Väre (Aalto University's Art+Design+Architecture building). Long receipt paper strips hung between second-floor fencing, connecting the M and R wings. Tension on strips controlled by a noise function that determines sag — creating zones of varying density and a lowered ceiling effect to create intimacy in a previously impersonal space. Process took nine months. Collaborative project with Guus Hoeberecht.

*Technologies: Computational design, Perlin noise function for physical form, parametric installation.*
`
	},
	{
		title: 'Helen — Electric Cabinet Street Art',
		year: '2024',
		url: 'helen',
		location: 'Helsinki, Finland',
		description:
			'Ongoing collaboration with Helen Oy painting electric cabinets across Helsinki with abstract and neoclassical stencil work since 2018.',
		content: `# Helen — Electric Cabinet Street Art

*2018–2026 (ongoing) | Helsinki, Finland*
*Stencil spray paint on metal, approx. 110 × 80 cm per cabinet*

Ongoing collaboration with Helen Oy (Helsinki's electric company), which invites artists to paint their electric cabinets across the city as part of a corporate social initiative. Has painted multiple boxes throughout Helsinki since 2018, exploring abstract and neoclassical art in this public medium — a code-to-paper-to-painting translation methodology. Collaborators include Monika Hauck, Margo Nowicka, Miguel García, and Kalle Eskelinen.
`
	},
	{
		title: 'Real Reality — ACRE, Espoo',
		year: '2024',
		url: 'real-reality',
		location: 'Espoo, Finland',
		description:
			'Immersive VR experience combining Gaussian Splatting scene capture with GenAI-generated art in real time via TouchDesigner.',
		content: `# Real Reality — ACRE, Espoo

*2024 | Espoo, Finland*
*VR interactive experience, 3 × 8 m*

Immersive VR exhibition examining what happens when our reality becomes a secondary stage. A monolithic VR headset hangs dim-lit in a dark room; entering the headset transports the visitor to the same room, well-lit and surrounded by artworks. Combines Gaussian Splatting (photorealistic 3D scene capture using probabilistic ellipsoidal distributions of colour/position/direction) with GenAI-generated art (Stable Diffusion) in real-time via TouchDesigner. Inspired by: Yulie, Olli Huttunen, Lyell Hintz, Tim Gerritsen.

*Technologies: VR (Oculus), TouchDesigner (real-time pipeline), Stable Diffusion, Gaussian Splatting (Lumalabs, SuperSplat, Jawset Postshot), Python.*
*Sound: Wild Perra.*
`
	},
	{
		title: 'Lala Salama Aurinko — Music Video',
		year: '2024',
		url: 'lala-salama-aurinko',
		location: 'Helsinki, Finland',
		description:
			'Music video for Lala Salama re-imagining band travel footage through AI to evoke the instability of memory.',
		content: `# Lala Salama Aurinko — Music Video

*2024 | Helsinki, Finland*

Directed and created visuals for the music video for "Aurinko sualtaa mun pään" by Helsinki rock band Lala Salama. Concept: re-imagining the band members' real travel footage through AI to evoke the instability of memory — how memories change and we become uncertain of what was real. Custom Stable Diffusion SDXL workflow in ComfyUI using ControlNet, IP Adapter, and video-to-video techniques.

*Technologies: Stable Diffusion SDXL, ComfyUI, ControlNet, IP Adapter, AnimateDiff (video-to-video pipeline).*
*(Shared public ComfyUI workflow: workflow_hsxl_sdxl.json)*
`
	},
	{
		title: 'Rottien Pyhimys — Greta Tuotanto',
		year: '2024',
		url: 'rottien-pyhimys',
		location: 'Helsinki, Finland',
		description:
			'Opera multi-channel video and set design restoring historical church murals with AI for a musical theatre piece based on Anneli Kanto.',
		content: `# Rottien Pyhimys — Greta Tuotanto

*2023–2025 | Helsinki, Finland*
*Opera multi-channel video, 3 × 12 m*

Video producer and set designer for a musical theatre piece based on the novel by Anneli Kanto, composed by Jukka Nykänen and directed by Reetta Ristimäki. Together with Margo Nowicka, produced visuals showing the 16th century Church of the Holy Cross in Hattula slowly filling with its paintings in full, restored colour — fantastical ornaments growing across surfaces. Used archaeological technique combined with AI large-format image restoration to faithfully recover historical murals. Performed at Kapsakki Teatteri and Alexanderin Teatteri. Part of Aalto University's MAGICS project.

*Technologies: AI image restoration (custom models), large-format super-resolution, historical data integration, TouchDesigner/compositing.*
*Press: Helsingin Sanomat, Kulttuuri Toimitus, Kapsakki.*
`
	},
	{
		title: 'VJ for e30v — Entropy RY',
		year: '2024',
		url: 'vj-e30v',
		location: 'Finland',
		description:
			"Live VJ set exploring real-time generative AI aesthetics within TouchDesigner at Entropy RY's 30th-year celebration.",
		content: `# VJ for e30v — Entropy RY

*2024 | Finland*

Invited to perform at the 30th-year celebration party of Entropy RY. Live VJ set exploring real-time generative AI aesthetics within TouchDesigner.

*Technologies: TouchDesigner, real-time generative AI, video mixing.*
`
	},
	{
		title: 'Tonni YLE — Yleisradio Oy',
		year: '2024',
		url: 'tonni-yle',
		location: 'Helsinki, Finland',
		description:
			'Art direction and AI production of demo videos for YLE Finland using Tonnin Seteli as source material.',
		content: `# Tonni YLE — Yleisradio Oy

*October 2023 – November 2024 | Helsinki, Finland*

Collaboration with Kalle Eskelinen for YLE Finland. Directed and produced a series of demo videos showcasing AI-generated media capabilities using the iconic Finnish meme *Tonnin Seteli* as source material. Managed the full pipeline from concept to delivery: custom Stable Diffusion workflows, ComfyUI automation, AnimateDiff video generation, ElevenLabs synthetic voice cloning, Python scripting for batch automation. Iterated across multiple generations of tooling (from 8h/video to 30min/video as models improved).

*Technologies: Stable Diffusion, ComfyUI, AnimateDiff, ElevenLabs, Python, automation scripting.*
`
	},
	{
		title: 'VJ for Wild Perra — Tokyo RY, Aalto University',
		year: '2023',
		url: 'vj-wild-perra',
		location: 'Helsinki, Finland',
		description:
			'Live VJ performance with Wild Perra at the annual Tokyo RY party at Aalto University.',
		content: `# VJ for Wild Perra — Tokyo RY, Aalto University

*2023 | Helsinki, Finland*

Performed a VJ set in collaboration with Wild Perra (shapeshifting musician blending horror, love, and absurdism) at the annual party organized by Tokyo RY (the art students' association of Aalto University).

*Technologies: Resolume/TouchDesigner, live video mixing.*
`
	},
	{
		title: 'Dresses — Generative Art with Pen Plotter',
		year: '2023',
		url: 'dresses',
		location: 'Helsinki, Finland',
		description:
			'Series of generative art dresses produced with p5.js algorithms and plotted on a pen plotter adapted from an Ender 3.',
		content: `# Dresses — Generative Art with Pen Plotter

*2023 | Helsinki, Finland*
*Ink on paper (pen plotter), 29.7 × 42.0 cm*

Series of generative art dresses produced for and plotted on a pen plotter. The work began as a commercial exercise but evolved into something personal — representing feelings at the time. Created using p5.js algorithms and plotted via a pen plotter adapted from a Creality Ender 3.

*Technologies: p5.js (generative art algorithms), pen plotter (Ender 3 + custom adapter designed in Fusion 360).*
`
	},
	{
		title: 'Yötön Yö — Kielo Dance Company',
		year: '2023',
		url: 'yoton-yo',
		location: 'Helsinki, Finland',
		description:
			"Art direction of video production for ballet works celebrating Sibelius' Sixth Symphony centenary at Tanssin Talo.",
		content: `# Yötön Yö — Kielo Dance Company

*October 2023 – November 2023 | Helsinki, Finland*
*Ballet single-channel video performance, 8 × 5 m*

Art director of video production for two small ballet/contemporary dance works by Kielo Dance Company at Tanssin Talo, celebrating the centenary of Sibelius' Sixth Symphony. Visuals explore the world of dreams across the different movements of the symphony, following the dancers. Co-created visuals with Merle Karp using real-time rendering, point clouds, generative and audio-reactive art, and sensor fusion.

*Technologies: TouchDesigner, point clouds, generative art, audio reactivity, sensor fusion.*
`
	},
	{
		title: 'Takeoff — UTM EU / Kinomural',
		year: '2023',
		url: 'takeoff',
		location: 'Espoo / Tartu / Wroclaw / Brussels',
		description:
			'360° planetarium audiovisual production for Urban Travel Machines; Kinomural 2023 Open Call winner.',
		content: `# Takeoff — UTM EU / Kinomural

*December 2022 – December 2024 | Espoo / Tartu, Estonia / Wroclaw, Poland / Brussels, Belgium*
*360° single-channel video and performance, 23 m dome*

Art director for a multidisciplinary audiovisual production for a planetarium exhibition. A visual interpretation of a poem by Giovanni Baudonck — a meditation on dreams as escapism, the protagonist describing their first "takeoff" into limitless fantasy, rejecting the absurdity of suffering. Part of the **Urban Travel Machines (UTM)** project, a collaboration between three art schools and four planetaria across Europe, co-funded by the Creative Europe Programme of the European Union.

Presented at: Prima Vista Literary Festival (Tartu, Estonia) as an immersive slam poetry performance in a dome planetarium; ZEBRA Poetry Film Festival 2023 (cinema version); **Kinomural 2023 Open Call — Winner** (as "Lightness"), Wroclaw, Poland; and the **UTM Poetry Festival in Brussels, December 2024** (final presentation).

*Technologies: Full-dome 360° video production, real-time rendering, 3D animation, generative visuals.*
*Collaborators: Hanna-Katri Eskelinen, Margo Nowicka.*
*Supported by: European Education and Culture Executive Agency (EACEA) / Creative Europe Programme of the European Union.*
`
	},
	{
		title: 'Sonorama R-Bus — Helsinki Art Museum (HAM)',
		year: '2023',
		url: 'sonorama-r-bus',
		location: 'Helsinki, Finland',
		description:
			"Master's thesis project: an evolutionary sonic Artificial Life installation blending physarum simulation, NEAT-guided neural networks and live urban audio.",
		content: `# Sonorama R-Bus — Helsinki Art Museum (HAM)

*January 2023 – September 2023 | Helsinki, Finland*
*Audiovisual ALife interactive installation — R-Bus Project*

Master's thesis project (MA New Media Arts), funded by the Helsinki Art Museum HAM. Sound and AI designer for the R-Bus installation — an autonomous driverless bus roaming the streets of Helsinki as part of Night of the Arts festival 2023.

Developed an Evolutionary Sonic Artificial Life system (*Sonorama*): urban soundscapes captured by microphones across the city are transformed into spectrograms, fed into a physarum agent-based simulation whose behaviour is controlled by a neural network guided by a NEAT genetic algorithm. The system uses IFFT to convert simulation outputs back to audio, producing a naturalistic synthetic ecosystem of sounds (whale-like, machine-like, insect-like) that evolves and adapts to live input. Implements autopoietic and sympoietic concepts. ~1,200 people experienced the installation.

*Technologies: Python, Max/MSP, NEAT evolutionary algorithms, neural networks, signal processing (FFT/IFFT), physarum simulation, agent-based modelling, acoustic ecology.*
*Collaboration: Laura Beloff (lead artist). Project: [r-bus.fi](https://www.r-bus.fi/).*
`
	},
	{
		title: 'Carlosverse — Identity Exhibition',
		year: '2023',
		url: 'carlosverse',
		location: 'Helsinki, Finland',
		description:
			'AI identity exploration of 600 distinct images from a custom model trained on Carlos, later adapted for Outsider Festival and Unframed Ticas.',
		content: `# Carlosverse — Identity Exhibition

*2023 | Helsinki, Finland*
*Multi-panel paper sheets, 4 × 12 m (ACRE) — later adapted for Outsider Festival 2025 and Unframed Ticas 2025*

AI identity exploration exhibiting 600 distinct images each crafted through a synthesis of AI systems. A custom model trained on ~100 images of "Carlos" (a specific individual), then used with diffusion generation to produce thousands of variations — mundane moments to alternate human realities. Some portray everyday life; others depict alternate realities where human nature has undergone metamorphosis.

Questions identity, individuality, ownership, and the human experience in a world where synthetic humans multiply. Exhibited first at ACRE, Helsinki (print format), then evolved into a digital video installation for **Outsider Art Festival 2025** and an AR mobile experience for **Unframed Ticas 2025** (Tartu, Estonia / Tampere, Finland).

*Technologies: Stable Diffusion, custom LoRA/Dreambooth model training, generative image pipeline; later: ElevenLabs (voice), AR mobile (Unframed edition).*
`
	},
	{
		title: 'Ihmisen Jälkeen — Finnish Chamber Opera',
		year: '2023',
		url: 'ihmisen-jalkeen',
		location: 'Helsinki, Finland',
		description:
			'Video production for a posthumanist chamber opera, ageing cast members with custom-trained AI models.',
		content: `# Ihmisen Jälkeen — Finnish Chamber Opera

*October 2022 – February 2023 | Helsinki, Finland*
*Opera single-channel video, 12 × 6 m*

Video production for an experimental chamber opera written and directed by Teemu Mäki, composed by Max Savikangas. The posthumanist opera explores how different intelligent forms could create life from scratch. In collaboration with Margo Nowicka and Teemu Mäki, developed a series of visual stories in which the cast were "aged" using custom-trained AI models generating interpretations of how their appearances might evolve over time — subtle, sensitive, and not confined to AI as subject matter but as creative medium.

*Technologies: Custom AI ageing models (Stable Diffusion fine-tuning / face manipulation), video compositing, generative simulations.*
*Press: Helsingin Sanomat, Kone Foundation.*
`
	},
	{
		title: 'VJ for Tokyo — Aalto University',
		year: '2022',
		url: 'vj-tokyo',
		location: 'Helsinki, Finland',
		description: 'Live VJ performance at the Tokyo RY annual event at Aalto University.',
		content: `# VJ for Tokyo — Aalto University

*2022 | Helsinki, Finland*

Live VJ performance at the Tokyo RY (Aalto art students' association) annual event.

*Technologies: Resolume/TouchDesigner, live video mixing.*
`
	},
	{
		title: 'Corrugations — Origami & Paper Studies',
		year: '2022',
		url: 'corrugations',
		location: 'Finland',
		description:
			'Deep exploration of origami and paper corrugation with Paul Jackson, from tessellations to crumpling and compliant mechanisms.',
		content: `# Corrugations — Origami & Paper Studies

*2022 | Finland*
*Folded paper, 28 × 21 cm*

Deep exploration of origami and paper corrugation techniques through a workshop with master origamist Paul Jackson. Progressed from simple tessellations through compliant mechanisms and one-crease curvature patterns to crumpling — organic forms that follow emergent rules. Included hand-casting experimentation. This study fundamentally influenced subsequent 3D printing, sculpture, and installation work.

*Techniques: Paper tessellation, origami, compliant mechanisms, curvature, crumpling, hand casting.*
`
	},
	{
		title: 'VJ for Rosa Jules',
		year: '2022',
		url: 'vj-rosa-jules',
		location: 'Helsinki, Finland',
		description: "Live VJ performance for Rosa Jules' event in Helsinki.",
		content: `# VJ for Rosa Jules

*2022 | Helsinki, Finland*

Live VJ performance for Rosa Jules' event.

*Technologies: Resolume, video mixing.*
`
	},
	{
		title: 'Invisible Lines — Dual Projection Installation',
		year: '2022',
		url: 'invisible-lines',
		location: 'Finland',
		description:
			'Dual projection installation responding to the Ukraine-Russia war — serene nature facing burning destruction across an invisible border.',
		content: `# Invisible Lines — Dual Projection Installation

*2022 | Finland*

Dual projection installation created in response to the Ukraine-Russia war (approximately 2–3 months in). Two large projections face each other: one side — serene nature imagery (waves, forest, reef) bleeding into the silhouette of a visitor, with calm soundscapes; the other — burning destruction with glitchy horror, crimson reds and blacks, sounds of underwater volcanoes and explosions. An invisible border in the middle reveals where one arrives and blurs what is left behind — an allegory for crossing the Ukraine-Poland border. Collaborative work with Margo Nowicka and Mathias Schach.

*Technologies: TouchDesigner, dual projection, real-time silhouette compositing, custom soundscapes.*
`
	},
	{
		title: "Explainable AI — Master's Thesis (MEng)",
		year: '2022',
		url: 'explainable-ai',
		location: 'Aalto University & FCAI, Espoo, Finland',
		description:
			'Human-in-the-loop system for improving deep learning explainability via Bayesian optimization of SHAP, segmentation, and classifier hyperparameters.',
		content: `# Explainable AI — Master's Thesis (MEng)

*2022 | Aalto University & FCAI, Espoo, Finland*

Master's thesis for MEng in Automation Engineering. Funded by Aalto University and FCAI (Finnish Center for AI). Published at RBCDSAI FCAI Conference on Deployable AI 2022.

Developed an interactive Human-in-the-Loop system to improve the interpretability of deep learning models. Users rated the sensibility of explanations (1–10) produced for individual image classifications by a VGG-16 network. Ratings fed back into a Bayesian Optimization loop that proposed new hyperparameters for three modules: the VGG-16 classifier, the Felzenszwalb image segmentator, and the SHAP explainer. Results showed that higher-rated explanation hyperparameters generally improved explainability without degrading classifier accuracy in the training set.

*Technologies: Python, PyTorch, VGG-16 (CNN), SHAP (Explainable AI), Bayesian Optimization, Felzenszwalb segmentation, user experience research.*
*Paper: [aaltodoc.aalto.fi](https://aaltodoc.aalto.fi/items/4b0abcff-324c-438d-9e86-2bcaf8e7c798)*
`
	},
	{
		title: 'Stranded Foundations — Mural, Space 21, Otaniemi',
		year: '2022',
		url: 'stranded-foundations',
		location: 'Otaniemi, Espoo, Finland',
		description:
			'Lead artist for a ~6×3 m mural generated from Perlin noise strand algorithms for Space 21 in Otaniemi.',
		content: `# Stranded Foundations — Mural, Space 21, Otaniemi

*2022 | Otaniemi, Espoo, Finland*

Lead artist for a ~6×3 m mural commissioned for the Space 21 building in Otaniemi. Used an iterative algorithm to generate large strands inhabiting a Perlin noise field, symbolising the constant changes and evolution inherent to the research process — Space 21 being designed for exploration and development of new ideas. Collaborative team: Monika Hauck, Katie Ballinger, Mathias Schach, Margo Nowicka, et al.

*Technologies: p5.js (Perlin noise, particle/strand systems), digital-to-physical translation.*
*Code: [editor.p5js.org/calvinguillot/sketches/HwC8xDMAff](https://editor.p5js.org/calvinguillot/sketches/HwC8xDMAff)*
`
	},
	{
		title: 'Pixel — Kinetic Origami Display',
		year: '2022',
		url: 'pixel',
		location: 'Finland',
		description:
			'Prototype mechanical display of kinetic origami pixels that open and close to represent greyscale values.',
		content: `# Pixel — Kinetic Origami Display

*2022 | Finland*

Concept and prototype for a mechanical display made of kinetic origami pixels that open and close to represent greyscale values (0–1), enabling display of greyscale images or generative art patterns. Explored screw-driven, thread-driven, and 3D-printed approaches before settling on a 3D-printed compliant mechanism module using threads to actuate the origami motif. Designed for modularity — allowing variable display sizes and shapes.

*Technologies: 3D printing (FDM), compliant mechanism design, Fusion 360, Arduino (actuation control), origami engineering.*
`
	},
	{
		title: 'Memoranda — Interactive Performance',
		year: '2021',
		url: 'memoranda',
		location: 'Katugalleria Mutteri, Helsinki, Finland',
		description:
			'Interactive performance where participants shared memories reinterpreted in real time as short audiovisual pieces.',
		content: `# Memoranda — Interactive Performance

*December 2021 | Katugalleria Mutteri, Helsinki, Finland*

Interactive performance at Katugalleria Mutteri. Participants entered the gallery and were invited to share personal memories; the artists (Calvin Guillot, Milja Komulainen, Lucien Montandon) reinterpreted them in real time as short audiovisual pieces. Performed 2–4 December 2021. Noted for the vulnerability and openness it elicited from participants.

*Technologies: Real-time rendering, generative art, live coding, TouchDesigner.*
`
	},
	{
		title: 'Lamp — Reed and 3D Print Lamp',
		year: '2021',
		url: 'lamp',
		location: 'Helsinki, Finland',
		description:
			'Custom lamp fabricated from dried reed sticks woven with jute fibre around a 3D-printed PLA core.',
		content: `# Lamp — Reed and 3D Print Lamp

*2021 | Helsinki, Finland*

Custom lamp designed and fabricated using dried reed sticks woven together with jute fibre, attached to a 3D-printed PLA core. Exploration of natural materials combined with digital fabrication.

*Technologies: 3D printing (PLA), Fusion 360 (core design), material: dried reed, jute fibre.*
`
	},
	{
		title: 'Trillium — Minimal Surface Sculpture',
		year: '2021',
		url: 'trillium',
		location: 'ACRE, Espoo, Finland',
		description:
			'Large-scale parametric willow and jute sculpture modelled as a minimal surface designed to decay with time.',
		content: `# Trillium — Minimal Surface Sculpture

*January 2021 – June 2021 | ACRE, Espoo, Finland*
*Willow and jute rope, 200 × 120 × 120 cm*

Large-scale parametric sculpture produced for ACRE (Aalto University). Computational simulations modelled a minimal surface using willow wood sticks, jute thread, and a metal platform. The structure was designed to decay with time, change with seasons, and eventually break down completely — a reflection on the idea that the only constant in life is change. Inspired by natural symmetries and projective geometry. Collaborative with Faezeh Sadeghi.

*Technologies: Computational simulation (minimal surface modelling), parametric design tools, physical fabrication (willow, jute, metal).*
`
	},
	{
		title: 'Fields — Perlin Noise Generative Art',
		year: '2021',
		url: 'fields',
		location: 'Online / p5.js',
		description:
			'Generative art series exploring Perlin noise fields in p5.js, with colours associated with states of feeling.',
		content: `# Fields — Perlin Noise Generative Art

*2021 | Online / p5.js*

Generative art series exploring Perlin noise fields in p5.js. Each field's colours are associated with states of feeling. A recurring aesthetic element reused across multiple later projects.

*Technologies: p5.js, Perlin noise algorithm.*
*Interactive: [editor.p5js.org/calvinguillot/full/VIUTrnhkt](https://editor.p5js.org/calvinguillot/full/VIUTrnhkt)*
`
	},
	{
		title: 'Birds — Boids Simulation',
		year: 'pre-2021',
		url: 'birds',
		location: 'p5.js',
		description:
			"Interactive p5.js simulation of emergent flocking behaviour using Craig Reynolds' Boids algorithm with quadTree optimisation.",
		content: `# Birds — Boids Simulation

*Pre-2021 | p5.js*

Interactive p5.js simulation of emergent flocking behaviour using Craig Reynolds' Boids algorithm (Separation, Alignment, Cohesion). Implemented a quadTree data structure for spatial optimisation and custom colour palettes. Users can adjust sliders to modify behaviour and save still images of their flock.

*Technologies: p5.js, quadTree, particle simulation.*
*Interactive: [editor.p5js.org/calvinguillot/full/_YGNrlxP-](https://editor.p5js.org/calvinguillot/full/_YGNrlxP-)*
`
	},
	{
		title: 'Math — Generative Art Explorations',
		year: 'pre-2021',
		url: 'math',
		location: 'Various',
		description:
			'Collection of mathematical and generative art explorations using p5.js and WebGL — noise, geometry, simulation, and visualisation.',
		content: `# Math — Generative Art Explorations

*Pre-2021 | Various*

A collection of mathematical and generative art explorations using p5.js and WebGL — experimenting with noise, geometry, simulation, and mathematical visualisation.
`
	},
	{
		title: 'Paintings — Traditional & Street Art',
		year: 'pre-2021',
		url: 'paintings',
		location: 'Ongoing',
		description:
			'Traditional painting practice alongside street art and mural work, using a code-to-paper-to-painting methodology.',
		content: `# Paintings — Traditional & Street Art

*Ongoing*

Traditional painting practice alongside street art and mural work. Code-to-paper-to-painting translation methodology used in multiple public commissions.
`
	}
];

const data = projects.map((p) => ({
	title: p.title,
	year: p.year,
	url: p.url,
	location: p.location,
	description: p.description,
	image: null,
	file: `${p.year}/${p.url}.md`
}));

const dataPath = join(root, 'src', 'lib', 'data', 'data.json');
writeFileSync(dataPath, JSON.stringify(data, null, '\t') + '\n', 'utf8');
console.log('Wrote', dataPath, `(${data.length} projects)`);

for (const p of projects) {
	const mdPath = join(root, 'src', 'lib', 'projects', p.year, `${p.url}.md`);
	mkdirSync(dirname(mdPath), { recursive: true });
	writeFileSync(mdPath, p.content.trim() + '\n', 'utf8');
	console.log('Wrote', mdPath);
}

const aboutContent = `# Calvin Guillot Suárez

**Creative Technologist | New Media Artist | Full Stack Developer**

- **Email:** [hello@calvinguillot.com](mailto:hello@calvinguillot.com)
- **LinkedIn:** [linkedin.com/in/calvinguillot](https://www.linkedin.com/in/calvinguillot/)
- **Social:** [@cgxatlas](https://www.instagram.com/cgxatlas/)
- **Location:** Helsinki, Finland
- **Origin:** Bogotá, Colombia

---

## Professional Summary

Multidisciplinary artist, creative technologist, and engineer from Bogotá, Colombia, based in Helsinki, Finland. Dual master's degrees in New Media Arts and Automation Engineering from Aalto University, plus a Bachelor's in Electronics. Over a decade of practice spanning interactive installations, generative AI, live audiovisual performance, VR/XR, web development, physical computing, and academic research.

Works at the intersection of art, science, and technology — creating visual stories, interactive installations, immersive experiences, and large-scale pieces. Explores the sublime, infinitism, identity, emergent behaviour, and social conflict through mediums ranging from traditional painting and street art to generative AI, parametric sculpture, and artificial synthetic life.

Track record includes internationally exhibited artwork (Expo 2025 Osaka, Outsider Art Festival, Aavistus Festival, Night of the Arts Helsinki), award-winning audiovisual work (Kinomural 2023), EU-funded collaborative productions, and commercial software development for analytics platforms and SEO-driven web products.
`;

const aboutPath = join(root, 'src', 'lib', 'about', 'about.md');
writeFileSync(aboutPath, aboutContent.trim() + '\n', 'utf8');
console.log('Wrote', aboutPath);
