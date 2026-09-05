import type { SquishTraits } from "../../types";

const TAU = Math.PI * 2;

const wave = (angle: number, frequency: number, cosine = 0, sine = 0) =>
  cosine * Math.cos(angle * frequency) + sine * Math.sin(angle * frequency);

function polarPoint(angle: number, radius: number, traits: SquishTraits) {
  return {
    x: traits.width * Math.cos(angle) * radius,
    y: traits.height * Math.sin(angle) * radius,
  };
}

function roundedPolygonPoint(
  angle: number,
  sides: number,
  radius: number,
  cornerRadius: number,
  rotation: number,
  traits: SquishTraits,
) {
  const ray = { x: Math.cos(angle), y: Math.sin(angle) };
  const halfInterior = ((sides - 2) * Math.PI) / (2 * sides);
  const tangentLength = cornerRadius / Math.tan(halfInterior);
  const centerInset = cornerRadius / Math.sin(halfInterior);
  let distance = Number.POSITIVE_INFINITY;

  for (let index = 0; index < sides; index++) {
    const vertexAngle = rotation + (index * TAU) / sides;
    const nextAngle = rotation + ((index + 1) * TAU) / sides;
    const vertex = {
      x: radius * Math.cos(vertexAngle),
      y: radius * Math.sin(vertexAngle),
    };
    const next = {
      x: radius * Math.cos(nextAngle),
      y: radius * Math.sin(nextAngle),
    };
    const edge = { x: next.x - vertex.x, y: next.y - vertex.y };
    const edgeLength = Math.hypot(edge.x, edge.y);
    const direction = { x: edge.x / edgeLength, y: edge.y / edgeLength };
    const start = {
      x: vertex.x + direction.x * tangentLength,
      y: vertex.y + direction.y * tangentLength,
    };
    const end = {
      x: next.x - direction.x * tangentLength,
      y: next.y - direction.y * tangentLength,
    };
    const segment = { x: end.x - start.x, y: end.y - start.y };
    const denominator = ray.x * segment.y - ray.y * segment.x;

    if (Math.abs(denominator) > 1e-9) {
      const alongRay =
        (start.x * segment.y - start.y * segment.x) / denominator;
      const alongEdge = (start.x * ray.y - start.y * ray.x) / denominator;
      if (alongRay >= 0 && alongEdge >= 0 && alongEdge <= 1)
        distance = Math.min(distance, alongRay);
    }

    const radial = { x: Math.cos(vertexAngle), y: Math.sin(vertexAngle) };
    const center = {
      x: vertex.x - radial.x * centerInset,
      y: vertex.y - radial.y * centerInset,
    };
    const projection = ray.x * center.x + ray.y * center.y;
    const discriminant =
      projection ** 2 - (center.x ** 2 + center.y ** 2 - cornerRadius ** 2);
    if (discriminant < 0) continue;
    const root = Math.sqrt(discriminant);
    for (const candidate of [projection - root, projection + root]) {
      if (candidate < 0) continue;
      const normalAngle = Math.atan2(
        candidate * ray.y - center.y,
        candidate * ray.x - center.x,
      );
      const arcDistance = Math.atan2(
        Math.sin(normalAngle - vertexAngle),
        Math.cos(normalAngle - vertexAngle),
      );
      if (Math.abs(arcDistance) <= Math.PI / sides)
        distance = Math.min(distance, candidate);
    }
  }

  return {
    x: traits.width * ray.x * distance,
    y: traits.height * ray.y * distance,
  };
}

/**
 * Returns the procedural edge point for the 'triangle' shape.
 */
export function trianglePoint(traits: SquishTraits, angle: number) {
  return roundedPolygonPoint(angle, 3, 1.46, 0.34, -Math.PI / 2, traits);
}

/**
 * Returns the procedural edge point for the 'hexagon' shape.
 */
export function hexagonPoint(traits: SquishTraits, angle: number) {
  return roundedPolygonPoint(angle, 6, 1.0802, 0.26, 0, traits);
}

/**
 * Returns the procedural edge point for the 'square' shape.
 */
export function squarePoint(traits: SquishTraits, angle: number) {
  return roundedPolygonPoint(angle, 4, 1.2536, 0.25, Math.PI / 4, traits);
}

/**
 * Returns the procedural edge point for the 'pentagon' shape.
 */
export function pentagonPoint(traits: SquishTraits, angle: number) {
  return roundedPolygonPoint(angle, 5, 1.139, 0.25, -Math.PI / 2, traits);
}

/**
 * Returns the procedural edge point for the 'octagon' shape.
 */
export function octagonPoint(traits: SquishTraits, angle: number) {
  return roundedPolygonPoint(angle, 8, 1.0365, 0.2, Math.PI / 8, traits);
}

/**
 * Returns the procedural edge point for the 'star' shape.
 */
export function starPoint(traits: SquishTraits, angle: number) {
  const radius = 0.88 + 0.22 * Math.cos(angle * 5);
  return {
    x: traits.width * Math.cos(angle) * radius,
    y: traits.height * Math.sin(angle) * radius,
  };
}

/**
 * Returns the procedural edge point for the 'flower' shape.
 */
export function flowerPoint(traits: SquishTraits, angle: number) {
  const radius = 0.9375 + 0.1125 * Math.cos(angle * 8);
  return {
    x: traits.width * Math.cos(angle) * radius,
    y: traits.height * Math.sin(angle) * radius,
  };
}

const cloudBump = (
  angle: number,
  center: number,
  width: number,
  amount: number,
) => {
  const delta = Math.atan2(Math.sin(angle - center), Math.cos(angle - center));
  return amount * Math.exp(-(delta * delta) / (2 * width * width));
};

const cloudRadius = (a: number) =>
  0.8422387 +
  // Three broad upper lobes give the silhouette a clearer cloud rhythm.
  cloudBump(a, -1.57, 0.36, 0.16) +
  cloudBump(a, -0.72, 0.44, 0.12) -
  // A cloud has a calmer, flatter underside than its crown.
  Math.max(0, Math.sin(a)) * 0.1 +
  wave(a, 1, -0.0323235, 0.0789311) +
  wave(a, 2, 0.0281204, 0.0050365) +
  wave(a, 3, 0.0116579, 0.0428747) +
  wave(a, 4, -0.0134179, -0.0169167) +
  wave(a, 5, -0.0102561, 0.049765) +
  wave(a, 6, -0.0038206, 0.0103565) +
  wave(a, 8, 0.0091071, -0.002668) +
  wave(a, 9, -0.0038829, 0.0016796) +
  wave(a, 10, 0.0064463, 0.0031359) +
  wave(a, 11, 0.0034112, 0.0022035) +
  wave(a, 12, 0.0007913, 0.0011971) +
  wave(a, 13, -0.0006873, -0.003813) +
  wave(a, 14, 0.0003652, 0.0005157) +
  wave(a, 15, 0.0009684, -0.0008358) +
  wave(a, 16, 0.0008058, -0.0008826) +
  wave(a, 17, 0.0010082, -0.0004585) +
  wave(a, 18, -0.0013058, 0.0000609) +
  wave(a, 19, -0.0003114, -0.0001693) +
  wave(a, 20, -0.0000504, -0.0002759);

const dropRadius = (a: number) =>
  0.7447678 +
  wave(a, 1, 0, 0.0890141) +
  wave(a, 2, -0.151536) +
  wave(a, 3, 0, 0.0773989) +
  wave(a, 4, 0.0443515) +
  wave(a, 5, 0, -0.0292999) +
  wave(a, 6, -0.0230356) +
  wave(a, 7, 0, 0.0181505) +
  wave(a, 8, 0.0130637) +
  wave(a, 9, 0, -0.009134) +
  wave(a, 10, -0.0070664) +
  wave(a, 11, 0, 0.0056967) +
  wave(a, 12, 0.0042896) +
  wave(a, 13, 0, -0.0029012) +
  wave(a, 14, -0.0020529) +
  wave(a, 15, 0, 0.0016059) +
  wave(a, 16, 0.0011353) +
  wave(a, 17, 0, -0.0005512) +
  wave(a, 18, -0.0001894) +
  wave(a, 19, 0, 0.000057) +
  wave(a, 20, -0.0001108) +
  wave(a, 21, 0, 0.0003802) +
  wave(a, 22, 0.0004395) +
  wave(a, 23, 0, -0.0004996) +
  wave(a, 24, -0.0005944) +
  wave(a, 25, 0, 0.0006431) +
  wave(a, 26, 0, 0.0006136) +
  wave(a, 27, 0, -0.0008002) +
  wave(a, 28, -0.0006186) +
  wave(a, 29, 0, 0.0007734) +
  wave(a, 30, 0, 0.0007272) +
  wave(a, 31, 0, -0.0006849);

/**
 * Returns the procedural edge point for the 'cloud' shape.
 */
export function cloudPoint(traits: SquishTraits, angle: number) {
  return polarPoint(angle, cloudRadius(angle), traits);
}

/**
 * Returns the procedural edge point for the 'drop' shape.
 */
export function dropPoint(traits: SquishTraits, angle: number) {
  return polarPoint(angle, dropRadius(angle), traits);
}
