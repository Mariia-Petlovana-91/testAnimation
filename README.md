# ✨ testAnimation

## Description

`testAnimation` is a web-based animation project that
generates and animates polygons using the **Voronoi
diagram** and **GSAP** animations. The project is built
using modern web technologies, including **TypeScript**,
**D3.js**, and **GSAP**, and is powered by **Vite** for fast
development and building.

## Technologies & Dependencies

### 📌 Core Technologies:

- **TypeScript** – Ensures type safety and enhances
  development efficiency.
- **Vite** – A fast and modern frontend build tool for
  development and production.

### 📌 Dependencies:

- **D3.js (`d3` ^7.9.0)** – Used for computational geometry,
  specifically to generate **Delaunay triangulation** and
  the **Voronoi diagram**, which are essential for creating
  polygonal shapes dynamically.
- **GSAP (`gsap` ^3.12.7)** – A powerful JavaScript
  animation library used to animate the polygons smoothly.

### 📌 Dev Dependencies:

- **@types/d3** – TypeScript definitions for D3.js.
- **TypeScript** – Adds static typing to JavaScript,
  improving code reliability and maintainability.
- **Vite** – Handles bundling and development for optimized
  performance.

## Why D3.js (`d3`)?

D3.js is used for:

- Generating **random points** within a defined area.
- Creating **Delaunay triangulation** to divide the area
  into connected triangles.
- Generating a **Voronoi diagram** from the triangulation to
  create unique polygonal shapes.

## Why GSAP (`gsap`)?

GSAP is used for:

- Creating **smooth animations** for polygons.
- Handling **complex motion sequences** with ease.
- Providing **better performance** compared to CSS
  animations or vanilla JavaScript.

## 🚀 Performance Optimization in Floating Animation

To enhance the performance of our animation, we applied
several key optimizations in our code.

1️⃣ Enable GPU Acceleration with `will-change` Adding
`will-change: transform` helps the browser optimize
rendering.

2️⃣ Use x and y Instead of transform: translate() Instead of
modifying the transform attribute directly, we use GSAP’s x
and y properties.

3️⃣ Optimization of DOM update, avoiding unnecessary
calculations
