import './style.css';

import gsap from 'gsap';
import * as d3 from 'd3';

import {
  RANDOM_NUMBER,
  COLOR_ARRAY,
  SIDE_LENGTH,
  DISTANCE_SIZE,
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

// * Optimized floating animation for polygons
// Scales the entire grid of polygons by a factor of 2 in both directions,
//   effectively expanding the plane by 4 times while keeping relative positions.
function startAnimation(): void {
  createPolygons(); // Generate polygons before animation

  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.delayedCall(1, startAnimation);
    },
  });

  const centerX = SIDE_LENGTH / 2;
  const centerY = SIDE_LENGTH / 2;

  polygons.forEach(
    ({ group, centerX: polyX, centerY: polyY }) => {
      gsap.set(group, { willChange: 'transform' });

      const scaledX =
        centerX + (polyX - centerX) * DISTANCE_SIZE;
      const scaledY =
        centerY + (polyY - centerY) * DISTANCE_SIZE;

      timeline.to(
        group,
        {
          duration: 1.5,
          x: scaledX - polyX,
          y: scaledY - polyY,
          ease: 'expoScale(0.5,7,none)',
        },
        0,
      );
    },
  );

  // Return polygons to original positions smoothly
  timeline.to(
    polygons.map((p) => p.group),
    {
      duration: 1.5,
      x: 0,
      y: 0,
      ease: 'slow(0.7,0.7,false)',
    },
  );
}

startAnimation();
