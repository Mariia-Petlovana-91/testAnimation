# ✨ testAnimation

## Description

`testAnimation` is a web-based animation project that
generates and animates polygons. The project is built using
modern web technologies, including **TypeScript**,
**polybooljs**, and **GSAP**, and is powered by **Vite** for
fast development and building.

## Technologies & Dependencies

### 📌 Core Technologies:

- **TypeScript** – Ensures type safety and enhances
  development efficiency.
- **Vite** – A fast and modern frontend build tool for
  development and production.

### 📌 Dependencies:

- **polybooljs (`polybooljs` ^1.2.2)**
- **GSAP (`gsap` ^3.12.7)**

### 📌 Dev Dependencies:

- **TypeScript** – Adds static typing to JavaScript,
  improving code reliability and maintainability.
- **Vite** – Handles bundling and development for optimized
  performance.

## Why polybool.js (`polybooljs`)?

polybool.js is used for:

- Performing boolean operations on polygons (union,
  difference, intersection).
- Combining or subtracting multiple polygonal regions.
- Avoiding complex, manual geometry computations by
  leveraging library-based logic.

## Why GSAP (`gsap`)?

GSAP is used for:

- Creating **smooth animations** for polygons.
- Handling **complex motion sequences** with ease.
- Providing **better performance** compared to CSS
  animations or vanilla JavaScript.

## 🚀 Performance Optimization in the Floating Animation

1️⃣ GPU Acceleration with will-change: 'transform': Before
animating each polygon, we call:

2️⃣ Using x and y Instead of transform: translate(...):
Instead of directly modifying the transform property, GSAP
lets us animate.

3️⃣ Minimal Recalculation of Positions and Appropriate GSAP
Easing Functions
