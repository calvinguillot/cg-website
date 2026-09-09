# Sonorama R-Bus

2023 | Aural Interactive Installation

This was my master thesis project for my MA Degree in New Media Arts. The project was funded by the Helsinki Art Museum HAM.

Acoustic ecology is an interdisciplinary field that aims to understand the relationship mediated through sound between human beings and their environment. The impact of industrialization and urbanization has led to a growing concern about noise pollution, its effects on wildlife, and how humans understand and perceive sounds in their increasingly loud habitats. Within this field, the niche hypothesis proposes that each species occupies a unique acoustic niche in the environment to minimize interference and maximize communication efficiency. Therefore, using these principles, this thesis aims to create a system that can simulate a natural sonic ecosystem that can react and adapt to natural and artificial sonic inputs. This work is part of a larger art project called R-Bus, where an autonomous driverless bus roams the streets of Helsinki.

![Sonorama 1](../../../assets/2023/sono_1.webp)

Urban soundscapes are captured by microphones deployed around the city and fed into an artificial life physarum simulation (Alife), where the system processes the incoming sound by ransforming the signals into a spectrogram, then feeding this into the simulation, and finally producing sounds by using IFFT from the resulting simulated image. The agent-based simulation is controlled by a neural
network (NN) guided by an evolutionary genetic algorithm (NEAT). This process determines the ecosystem’s behavior and final sonic expression. The system also implements autopoietic and sympoietic concepts that describe life as self-organizing and co-evolving systems to produce a naturalistic evolutionary process. The resulting audio signal is played for the audience inside the bus alongside the signals from the microphones and other soundscapes. The sounds produced by the ALife simulation vary widely, ranging from whale-like to machine-like and encompassing various insect-like noises and other mechanical sounds.

![Sonorama 2](../../../assets/2023/sono_2.webp)

Image (A) shows creatures that are stable at higher frequencies. Image (B) shows a more homogeneous distribution. The image (C) showcases a good example of adaptability, where stable bands can be observed. Image (D) is an example of a larger emergent structure that quickly recovers after a disruption is triggered in the middle-range frequencies.


<video controls playsinline preload="metadata">
  <source src="../../../assets/2023/sono_video.webm" type="video/webm" />
  Sonorama Video
</video>

Niche differentiation was achieved, though the agents’ lifetimes were relatively short, and convergence was not always observed. Approximately 1,200 people experienced the R-Bus installation. For some participants, the sounds were familiar, understandable, and even described as beautiful, while for others, the synthetic sounds were imperceptible. This project highlights the disruption that human-generated sounds cause to natural environments and offers a system that could be used to understand this disruption better, as well as the relationship between humans and their sonic environment.

Below are some sounds produced by the system:

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-1.wav" type="audio/wav" />
  Sonorama Sample 1
</audio>

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-2.wav" type="audio/wav" />
  Sonorama Sample 2
</audio>

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-3.wav" type="audio/wav" />
  Sonorama Sample 3
</audio>

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-4.wav" type="audio/wav" />
  Sonorama Sample 4
</audio>

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-5.wav" type="audio/wav" />
  Sonorama Sample 5
</audio>

<audio controls preload="metadata">
  <source src="../../../assets/2023/sonorama_sample-6.wav" type="audio/wav" />
  Sonorama Sample 6
</audio>

![Sonorama 3](../../../assets/2023/sono_3.webp)

![Sonorama 4](../../../assets/2023/sono_4.webp)

You can find the thesis [here.](https://aaltodoc.aalto.fi/items/68557bcd-f44c-4693-8728-4caa2d415864)
