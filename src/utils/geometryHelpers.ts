import { Point, PolygonGeom } from './interface';
import { generateRandomNumber } from './generator';
import {
  RANDOM_NUMBER,
  SIDE_LENGTH,
} from '../constants/constants';

//  * Creates an initial square (0,0)-(SIDE_LENGTH,SIDE_LENGTH).-----------------------------
export function createInitialSquare(): PolygonGeom {
  return [
    { x: 0, y: 0 },
    { x: SIDE_LENGTH, y: 0 },
    { x: SIDE_LENGTH, y: SIDE_LENGTH },
    { x: 0, y: SIDE_LENGTH },
  ];
}

//  * Generates a random number (from RANDOM_NUMBER.min to RANDOM_NUMBER.max)------------------
//  lines, each of which goes from one side of the square to the other.
export function generateRandomLines(): Array<
  [Point, Point]
> {
  const count = generateRandomNumber(
    RANDOM_NUMBER.min,
    RANDOM_NUMBER.max,
  );
  const lines: Array<[Point, Point]> = [];

  for (let i = 0; i < count; i++) {
    const edge1 = Math.floor(Math.random() * 4);
    let edge2 = Math.floor(Math.random() * 4);
    while (edge2 === edge1) {
      edge2 = Math.floor(Math.random() * 4);
    }
    const p1 = randomPointOnEdge(edge1);
    const p2 = randomPointOnEdge(edge2);
    lines.push([p1, p2]);
  }

  return lines;
}

//  * Generates a point (x, y) on the edge of the square (0..3):  0: top, 1: right, 2: bottom, 3: left.
export function randomPointOnEdge(
  edgeIndex: number,
): Point {
  switch (edgeIndex) {
    case 0:
      return { x: Math.random() * SIDE_LENGTH, y: 0 };
    case 1:
      return {
        x: SIDE_LENGTH,
        y: Math.random() * SIDE_LENGTH,
      };
    case 2:
      return {
        x: Math.random() * SIDE_LENGTH,
        y: SIDE_LENGTH,
      };
    case 3:
      return { x: 0, y: Math.random() * SIDE_LENGTH };
    default:
      return { x: 0, y: 0 };
  }
}

//  * We successively \"cut\" the initial square with the generated lines-----------------------------
//   and return an array of polygons (pieces).
export function subdivideSquareWithLines(): PolygonGeom[] {
  let polygonList: PolygonGeom[] = [createInitialSquare()];
  const lines = generateRandomLines();

  for (const [A, B] of lines) {
    const newPolys: PolygonGeom[] = [];
    for (const poly of polygonList) {
      const splitted = cutPolygonByLine(poly, A, B);
      newPolys.push(...splitted);
    }
    polygonList = newPolys;
  }

  return polygonList;
}

//  * Cuts the polygon with the segment [A->B].Returns 1 or 2 polygons (if there were actually 2 intersections).
export function cutPolygonByLine(
  poly: PolygonGeom,
  A: Point,
  B: Point,
): PolygonGeom[] {
  const leftSide: Point[] = [];
  const rightSide: Point[] = [];
  let intersectionCount = 0;

  for (let i = 0; i < poly.length; i++) {
    const cur = poly[i];
    const nxt = poly[(i + 1) % poly.length];

    const sideCur = lineSide(A, B, cur);
    if (sideCur >= 0) {
      leftSide.push(cur);
    } else {
      rightSide.push(cur);
    }

    const inter = segmentIntersection(cur, nxt, A, B);
    if (inter) {
      intersectionCount++;
      leftSide.push(inter);
      rightSide.push(inter);
    }
  }

  if (intersectionCount < 2) {
    return [poly];
  }

  const polyLeft = cleanUpPolygon(leftSide);
  const polyRight = cleanUpPolygon(rightSide);
  return [polyLeft, polyRight];
}

// *To determine on which side of the line [A->B] the point P lies.----------------------------
export function lineSide(
  A: Point,
  B: Point,
  P: Point,
): number {
  return (
    (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x)
  );
}

// * Checks the intersection of segments [P1->P2] and [P3->P4].----------------------
export function segmentIntersection(
  P1: Point,
  P2: Point,
  P3: Point,
  P4: Point,
): Point | null {
  const x1 = P1.x,
    y1 = P1.y,
    x2 = P2.x,
    y2 = P2.y,
    x3 = P3.x,
    y3 = P3.y,
    x4 = P4.x,
    y4 = P4.y;

  const denom =
    (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denom === 0) return null;

  const px =
    ((x1 * y2 - y1 * x2) * (x3 - x4) -
      (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denom;
  const py =
    ((x1 * y2 - y1 * x2) * (y3 - y4) -
      (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denom;

  if (
    px < Math.min(x1, x2) ||
    px > Math.max(x1, x2) ||
    py < Math.min(y1, y2) ||
    py > Math.max(y1, y2) ||
    px < Math.min(x3, x4) ||
    px > Math.max(x3, x4) ||
    py < Math.min(y3, y4) ||
    py > Math.max(y3, y4)
  ) {
    return null;
  }
  return { x: px, y: py };
}

// * Removes duplicate points (up to 3 digits).-------------------------------------------
export function cleanUpPolygon(
  points: Point[],
): PolygonGeom {
  const unique: Point[] = [];
  const visited = new Set<string>();
  for (const pt of points) {
    const key = pt.x.toFixed(3) + ',' + pt.y.toFixed(3);
    if (!visited.has(key)) {
      visited.add(key);
      unique.push(pt);
    }
  }
  return unique;
}
