import type { SquishShape, SquishTraits } from '../../types'
import { circlePoint, pebblePoint, squirclePoint, capsulePoint } from './primitives'
import { trianglePoint, hexagonPoint, squarePoint, pentagonPoint, octagonPoint, starPoint, flowerPoint, cloudPoint, dropPoint } from './polygons'
import { catPoint, ghostPoint, ufoPoint, botPoint, alienPoint, lionPoint, monkeyPoint, mechaPoint } from './characters'

export interface ShapeGeometry {
  traits: SquishTraits
  point(angle: number): { x: number; y: number }
}

const SHAPE_MAP: Record<SquishShape, (traits: SquishTraits, angle: number) => { x: number; y: number }> = {
  circle: circlePoint,
  pebble: pebblePoint,
  squircle: squirclePoint,
  capsule: capsulePoint,
  triangle: trianglePoint,
  hexagon: hexagonPoint,
  square: squarePoint,
  pentagon: pentagonPoint,
  octagon: octagonPoint,
  star: starPoint,
  flower: flowerPoint,
  cloud: cloudPoint,
  drop: dropPoint,
  cat: catPoint,
  ghost: ghostPoint,
  ufo: ufoPoint,
  bot: botPoint,
  alien: alienPoint,
  lion: lionPoint,
  monkey: monkeyPoint,
  mecha: mechaPoint,
}

export function shapeTraits(base: SquishTraits, _shape: SquishShape): SquishTraits {
  return { ...base }
}

export function shapeGeometry(base: SquishTraits, shape: SquishShape): ShapeGeometry {
  const traits = shapeTraits(base, shape)
  const pointAt = SHAPE_MAP[shape] ?? circlePoint
  return { traits, point: (angle) => pointAt(traits, angle) }
}

export function blendGeometry(from: ShapeGeometry, to: ShapeGeometry, amount: number): ShapeGeometry {
  const mix = (a: number, b: number) => a + (b - a) * amount
  return {
    traits: {
      width: mix(from.traits.width, to.traits.width),
      height: mix(from.traits.height, to.traits.height),
      softness: mix(from.traits.softness, to.traits.softness),
      lean: mix(from.traits.lean, to.traits.lean),
      eyeGap: mix(from.traits.eyeGap, to.traits.eyeGap),
      eyeSize: mix(from.traits.eyeSize, to.traits.eyeSize),
      eyeHeight: mix(from.traits.eyeHeight, to.traits.eyeHeight),
      hue: mix(from.traits.hue, to.traits.hue),
      tone: mix(from.traits.tone, to.traits.tone)
    },
    point: (angle) => {
      const a = from.point(angle)
      const b = to.point(angle)
      return { x: mix(a.x, b.x), y: mix(a.y, b.y) }
    }
  }
}
