import './style.css';

import gsap from 'gsap';
import * as d3 from 'd3';

import {
  RANDOM_NUMBER,
  COLOR_ARRAY,
  DISTANCE_SIZE,
  SIDE_LENGTH,
} from './constants/constants';

import { PolygonData } from './utils/interface';
import {
  generateRandomPoints,
  getRandomColor,
  getRandomNumber,
} from './utils/generator';

// * Get the SVG element------------------------------------------------------
// Select the SVG canvas where the polygons will be drawn.
const svgCanvas =
  document.querySelector<SVGSVGElement>('#svgCanvas');
if (!svgCanvas) {
  throw new Error('SVG element not found!');
}

// * Creating an array of future polygons-------------------------------------
// This array will store polygon data including their SVG elements and coordinates.
let polygons: PolygonData[] = [];

// * The function that creates polygons based on the Voronoi diagram----------
// This function generates polygons using D3's Delaunay triangulation and Voronoi diagram.
function createPolygons(): void {
  if (!svgCanvas) return;

  // Clear the existing polygons before creating new ones
  svgCanvas.innerHTML = '';
  polygons = [];

  // Generate a set of random points within the defined area
  const points: [number, number][] = generateRandomPoints(
    getRandomNumber(RANDOM_NUMBER.min, RANDOM_NUMBER.max),
    SIDE_LENGTH,
  );

  // Generate a Delaunay triangulation and a Voronoi diagram from the points
  const delaunay = d3.Delaunay.from(points);
  const voronoi = delaunay.voronoi([
    0,
    0,
    SIDE_LENGTH,
    SIDE_LENGTH,
  ]);

  // Iterate through each point and create a polygon
  for (let i = 0; i < points.length; i++) {
    const cell: [number, number][] | undefined =
      voronoi.cellPolygon(i);
    if (!cell) continue;

    const centerX: number = points[i][0];
    const centerY: number = points[i][1];

    // * Create an SVG group element <g> to contain the polygon
    const group: SVGGElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g',
    );
    group.setAttribute('transform', `translate(0,0)`);
    svgCanvas.appendChild(group);

    // * Create the actual polygon element <polygon>
    const polygon: SVGPolygonElement =
      document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon',
      );
    polygon.setAttribute(
      'points',
      cell.map((p) => `${p[0]},${p[1]}`).join(' '),
    );

    // Assign a random color from the predefined color array
    polygon.setAttribute(
      'fill',
      getRandomColor(COLOR_ARRAY),
    );

    // Append the polygon to its group
    group.appendChild(polygon);

    // Store polygon data for animation
    polygons.push({
      group,
      centerX,
      centerY,
    });
  }
}

/**
 * Optimized floating animation for polygons
 */
function startAnimation(): void {
  createPolygons(); // Create polygons before animation

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.delayedCall(1, startAnimation); // More efficient than setTimeout
    },
  });

  polygons.forEach(({ group, centerX, centerY }) => {
    const dx: number = centerX - SIDE_LENGTH / 2;
    const dy: number = centerY - SIDE_LENGTH / 2;
    const moveX: number = dx * DISTANCE_SIZE;
    const moveY: number = dy * DISTANCE_SIZE;

    gsap.set(group, { willChange: 'transform' }); // Hint for performance

    timeline.to(
      group,
      {
        duration: 2,
        x: moveX, // Using x instead of transform for GPU acceleration
        y: moveY,
        ease: 'power2.out',
      },
      0,
    );
  });

  // Return polygons to their original position
  timeline.to(
    polygons.map((p) => p.group),
    {
      duration: 2,
      x: 0,
      y: 0,
      ease: 'power2.in',
    },
    '+=1',
  );
}
startAnimation();
