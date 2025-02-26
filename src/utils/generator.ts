// * Generation of an array of random points within a square-----------------------
export function generateRandomPoints(
  numPoints: number,
  size: number,
): [number, number][] {
  let points: [number, number][] = [];
  for (let i = 0; i < numPoints; i++) {
    points.push([
      Math.random() * size,
      Math.random() * size,
    ]);
  }
  return points;
}

// * Generate a random number in the range for the polygon------------------------
export function generateRandomNumber(
  min: number,
  max: number,
) {
  return Math.floor(Math.random() * (max - min) + min);
}

// * Generate a random color for the polygon-------------------------------------
export function getRandomColor(colors: string[]): string {
  const randomColor =
    colors[Math.floor(Math.random() * colors.length)];
  return `${randomColor}`;
}
