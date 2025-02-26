import './style.css';
import gsap from 'gsap';
import {
  PolygonGeom,
  PolygonData,
} from './utils/interface';
import { subdivideSquareWithLines } from './utils/geometryHelpers';
import {
  SIDE_LENGTH,
  DISTANCE_SIZE,
  COLOR_ARRAY,
} from './constants/constants';
import { getRandomColor } from './utils/generator';

/**
 * drawPolygons function:
 * 1) Clears <svg>.
 * 2) Based on the array of geometric polygons (PolygonGeom[]) creates <g> + <polygon>.
 * 3) Calculates the center (x,y) of each polygon.
 * 4) Returns a PolygonData[] array (so we can animate).
 */
export function drawPolygons(
  svgCanvas: SVGSVGElement,
  polygonsGeom: PolygonGeom[],
): PolygonData[] {
  svgCanvas.innerHTML = '';

  const result: PolygonData[] = [];

  for (const geom of polygonsGeom) {
    const group = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g',
    );
    svgCanvas.appendChild(group);

    const polygonEl = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'polygon',
    );
    const pointsStr = geom
      .map((p) => `${p.x},${p.y}`)
      .join(' ');
    polygonEl.setAttribute('points', pointsStr);

    polygonEl.setAttribute(
      'fill',
      getRandomColor(COLOR_ARRAY),
    );
    group.appendChild(polygonEl);

    let sx = 0,
      sy = 0;
    for (const p of geom) {
      sx += p.x;
      sy += p.y;
    }
    const cx = sx / geom.length;
    const cy = sy / geom.length;

    result.push({
      group,
      centerX: cx,
      centerY: cy,
    });
  }

  return result;
}

/**
 * function createAnimation:
 * 1) Subdivides a square (subdivideSquareWithLines).
 * 2) Calls drawPolygons(..), receiving an array of PolygonData[].
 * 3) Creates a GSAP timeline, "explodes" polygons, then returns.
 * 4) At the end of the animation, it causes itself again (after 1s).
 */
export function createAnimation(
  svgCanvas: SVGSVGElement,
): void {
  const polygonsGeom = subdivideSquareWithLines();
  const polygons: PolygonData[] = drawPolygons(
    svgCanvas,
    polygonsGeom,
  );
  const timeline = gsap.timeline({
    onComplete: () => {
      gsap.delayedCall(1, () => createAnimation(svgCanvas));
    },
  });

  const centerX = SIDE_LENGTH / 2;
  const centerY = SIDE_LENGTH / 2;

  polygons.forEach(
    ({ group, centerX: px, centerY: py }) => {
      gsap.set(group, { willChange: 'transform' });

      const scaledX =
        centerX + (px - centerX) * DISTANCE_SIZE;
      const scaledY =
        centerY + (py - centerY) * DISTANCE_SIZE;

      timeline.to(
        group,
        {
          duration: 1.5,
          x: scaledX - px,
          y: scaledY - py,
          ease: 'expoScale(0.5, 7, none)',
        },
        0,
      );
    },
  );

  timeline.to(
    polygons.map((p) => p.group),
    {
      duration: 1.5,
      x: 0,
      y: 0,
      ease: 'slow(0.7, 0.7, false)',
    },
  );
}

/**
 * 1).We get an element in which we draw polygons
 * 2) We check whether such an element really exists.
 * 3) We pass it to the call of the generation function, which in this element draws the animation.
 */
const isSvg = document.getElementById('svgCanvas');

if (!isSvg) {
  throw new Error("Element with id='svgCanvas' not found!");
}

if (!(isSvg instanceof SVGSVGElement)) {
  throw new Error('Element is not an SVGSVGElement!');
}

createAnimation(isSvg);
