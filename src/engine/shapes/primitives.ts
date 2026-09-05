import type { SquishTraits } from "../../types";

/**
 * Returns the procedural edge point for the 'circle' body shape.
 */
export function circlePoint(traits: SquishTraits, angle: number) {
  return {
    x: traits.width * Math.cos(angle),
    y: traits.height * Math.sin(angle),
  };
}

/**
 * Returns the procedural edge point for the 'pebble' body shape (asymmetric organic curve).
 */
export function pebblePoint(traits: SquishTraits, angle: number) {
  const direction = { x: Math.cos(angle), y: Math.sin(angle) };
  let hit = 0;

  const curves = [
    [
      { x: 0, y: -0.84 },
      { x: 0.46, y: -0.84 },
      { x: 0.82, y: -0.56 },
      { x: 0.82, y: -0.14 },
    ],
    [
      { x: 0.82, y: -0.14 },
      { x: 0.82, y: 0.34 },
      { x: 0.48, y: 0.74 },
      { x: 0, y: 0.74 },
    ],
    [
      { x: 0, y: 0.74 },
      { x: -0.48, y: 0.74 },
      { x: -0.82, y: 0.34 },
      { x: -0.82, y: -0.14 },
    ],
    [
      { x: -0.82, y: -0.14 },
      { x: -0.82, y: -0.56 },
      { x: -0.46, y: -0.84 },
      { x: 0, y: -0.84 },
    ],
  ];
  const cross = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    a.x * b.y - a.y * b.x;
  const pointOnCurve = (curve: (typeof curves)[number], t: number) => {
    const u = 1 - t;
    return {
      x:
        u ** 3 * curve[0].x +
        3 * u ** 2 * t * curve[1].x +
        3 * u * t ** 2 * curve[2].x +
        t ** 3 * curve[3].x,
      y:
        u ** 3 * curve[0].y +
        3 * u ** 2 * t * curve[1].y +
        3 * u * t ** 2 * curve[2].y +
        t ** 3 * curve[3].y,
    };
  };

  for (const curve of curves) {
    let previous = curve[0];
    for (let index = 1; index <= 24; index++) {
      const current = pointOnCurve(curve, index / 24);
      const edge = { x: current.x - previous.x, y: current.y - previous.y };
      const denominator = cross(direction, edge);
      if (Math.abs(denominator) > 1e-7) {
        const distance = cross(previous, edge) / denominator;
        const segment = cross(previous, direction) / denominator;
        if (distance > 0 && segment >= 0 && segment <= 1)
          hit = Math.max(hit, distance);
      }
      previous = current;
    }
  }

  const normalizedX = (direction.x * hit) / 0.82;
  const normalizedY = (direction.y * hit + 0.05) / 0.79;
  return { x: normalizedX * traits.width, y: normalizedY * traits.height };
}

/**
 * Returns the procedural edge point for the 'squircle' (rounded square) body shape.
 */
export function squirclePoint(traits: SquishTraits, angle: number) {
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);
  const radius =
    0.9128 / (Math.abs(cosine) ** 6 + Math.abs(sine) ** 6) ** (1 / 6);
  return {
    x: traits.width * cosine * radius,
    y: traits.height * sine * radius,
  };
}

/**
 * Returns the procedural edge point for the 'capsule' body shape.
 */
export function capsulePoint(traits: SquishTraits, angle: number) {
  const xDirection = Math.cos(angle);
  const yDirection = Math.sin(angle);
  const candidates: number[] = [];
  if (Math.abs(yDirection) > 1e-9) {
    const flatEdge = 0.62 / Math.abs(yDirection);
    if (Math.abs(flatEdge * xDirection) <= 0.42) candidates.push(flatEdge);
  }
  for (const capCenter of [-0.42, 0.42]) {
    const projection = capCenter * xDirection;
    const discriminant = projection ** 2 - (capCenter ** 2 - 0.62 ** 2);
    if (discriminant >= 0)
      candidates.push(projection + Math.sqrt(discriminant));
  }
  const distance = Math.max(...candidates);
  return {
    x: traits.width * distance * xDirection,
    y: traits.height * distance * yDirection,
  };
}
