import type { SquishTraits } from '../types'
import { seedNumber, unit, between } from '../core/hash'
import type { ShapeGeometry } from './shapes'

export type FittedEye = {
  width: number
  height: number
  matrix: [number, number, number, number, number, number]
}

export function traitsFor(name: string, overrides: Partial<SquishTraits> = {}): SquishTraits {
  const seed = seedNumber(name)
  const generated: SquishTraits = {
    width: 1,
    height: 1,
    softness: 0.56,
    lean: 0,
    eyeGap: 0.49,
    eyeSize: 1,
    eyeHeight: 0,
    hue: between(unit(seed, 7), 0, 360),
    tone: unit(seed, 8)
  }
  return { ...generated, ...overrides }
}

type Point = { x: number; y: number }

const TARGET_INSET = 1
const SEARCH_ROUNDS = 12
const DIRECTIONS = 16

function boundaryRadius(geometry: ShapeGeometry, angle: number) {
  const point = geometry.point(angle)
  return Math.hypot(point.x, point.y) * 100
}

function transform(eye: FittedEye, x: number, y: number): Point {
  const [a, b, c, d, e, f] = eye.matrix
  return { x: a * x + c * y + e, y: b * x + d * y + f }
}

function capsuleBoundary(eye: FittedEye): Point[] {
  const halfWidth = eye.width / 2
  const halfHeight = eye.height / 2
  const radius = Math.min(halfWidth, halfHeight)
  const points: Point[] = []
  const arc = (cx: number, cy: number, start: number) => {
    for (let index = 0; index <= 12; index++) {
      const angle = start + (index / 12) * Math.PI
      points.push(transform(eye, cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius))
    }
  }

  if (halfHeight >= halfWidth) {
    const stem = halfHeight - radius
    arc(0, -stem, Math.PI)
    arc(0, stem, 0)
    for (let index = 1; index < 6; index++) {
      const y = -stem + (index / 6) * stem * 2
      points.push(transform(eye, -radius, y), transform(eye, radius, y))
    }
  } else {
    const stem = halfWidth - radius
    arc(-stem, 0, Math.PI / 2)
    arc(stem, 0, -Math.PI / 2)
    for (let index = 1; index < 6; index++) {
      const x = -stem + (index / 6) * stem * 2
      points.push(transform(eye, x, -radius), transform(eye, x, radius))
    }
  }
  return points
}

function clearance(geometry: ShapeGeometry, eyes: FittedEye[], dx = 0, dy = 0) {
  let minimum = Number.POSITIVE_INFINITY
  for (const eye of eyes) {
    for (const point of capsuleBoundary(eye)) {
      const x = point.x + dx
      const y = point.y + dy
      minimum = Math.min(minimum, boundaryRadius(geometry, Math.atan2(y, x)) - Math.hypot(x, y))
    }
  }
  return minimum
}

function translated(eyes: FittedEye[], dx: number, dy: number) {
  return eyes.map((eye) => {
    const matrix = [...eye.matrix] as FittedEye['matrix']
    matrix[4] += dx
    matrix[5] += dy
    return { ...eye, matrix }
  })
}

function solveTranslation(geometry: ShapeGeometry, eyes: FittedEye[]) {
  const initial = clearance(geometry, eyes)
  if (initial >= TARGET_INSET) return { x: 0, y: 0, clearance: initial }

  let x = 0
  let y = 0
  let best = initial
  let step = 28
  for (let round = 0; round < SEARCH_ROUNDS; round++) {
    let nextX = x
    let nextY = y
    let nextBest = best
    for (let index = 0; index < DIRECTIONS; index++) {
      const angle = (index / DIRECTIONS) * Math.PI * 2
      const candidateX = x + Math.cos(angle) * step
      const candidateY = y + Math.sin(angle) * step
      const candidate = clearance(geometry, eyes, candidateX, candidateY)
      if (candidate > nextBest + 0.001) {
        nextBest = candidate
        nextX = candidateX
        nextY = candidateY
      }
    }
    if (nextX === x && nextY === y) step *= 0.5
    else {
      x = nextX
      y = nextY
      best = nextBest
    }
  }

  if (best >= TARGET_INSET) {
    let low = 0
    let high = 1
    for (let index = 0; index < 10; index++) {
      const middle = (low + high) / 2
      if (clearance(geometry, eyes, x * middle, y * middle) >= TARGET_INSET) high = middle
      else low = middle
    }
    x *= high
    y *= high
    best = clearance(geometry, eyes, x, y)
  }
  return { x, y, clearance: best }
}

function projectCenters(geometry: ShapeGeometry, eyes: FittedEye[]) {
  return eyes.map((eye) => {
    const matrix = [...eye.matrix] as FittedEye['matrix']
    const angle = Math.atan2(matrix[5], matrix[4])
    const localScale = boundaryRadius(geometry, angle) / 100
    matrix[4] *= localScale
    matrix[5] *= localScale
    return { ...eye, matrix }
  })
}

export function fitEyesToShape(geometry: ShapeGeometry, source: FittedEye[]): FittedEye[] {
  const projected = projectCenters(geometry, source)
  let eyes = projected
  let correction = solveTranslation(geometry, eyes)
  if (correction.clearance < 0) {
    for (let scale = 0.96; scale >= 0.56 && correction.clearance < 0; scale -= 0.04) {
      const resized = projected.map((eye) => ({ ...eye, width: eye.width * scale, height: eye.height * scale }))
      const candidate = solveTranslation(geometry, resized)
      if (candidate.clearance > correction.clearance) {
        eyes = resized
        correction = candidate
      }
    }
  }
  return translated(eyes, correction.x, correction.y)
}

export function minimumEyeClearance(geometry: ShapeGeometry, eyes: FittedEye[]) {
  return clearance(geometry, eyes)
}
