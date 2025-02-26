// * Polygon structure for animation-------------------------------
export interface PolygonData {
  group: SVGGElement;
  centerX: number;
  centerY: number;
}

// * Point (x, y) on the coordinate plane.--------------------------
export interface Point {
  x: number;
  y: number;
}

// * We describe a polygon as an array of points (vertices).--------
export type PolygonGeom = Point[];
