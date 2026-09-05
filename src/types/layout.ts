/**
 * Procedural base traits deterministically generated from the seed.
 * These metrics define the physical structure and proportions of the avatar.
 */
export interface SquishTraits {
  /** Relative horizontal width factor. */
  width: number
  /** Relative vertical height factor. */
  height: number
  /** Geometry corner rounding softness. */
  softness: number
  /** Structural lean/tilt of the body. */
  lean: number
  /** Horizontal gap distance between the eyes. */
  eyeGap: number
  /** Scaling factor for eye size. */
  eyeSize: number
  /** Vertical placement ratio for the eyes. */
  eyeHeight: number
  /** Hue variance for procedural coloring. */
  hue: number
  /** Tone/saturation variance for procedural coloring. */
  tone: number
}

/**
 * Resolved layout data for rendering a single frame.
 * Contains calculated SVG paths and structural matrices.
 */
export interface SquishLayout {
  /** Generated deterministic numeric seed. */
  seed: number
  /** Underlying procedural traits used to build the layout. */
  traits: SquishTraits
  /** Resolved SVG path data string for the avatar body. */
  body: string
  /** 
   * Resolved eyes data. 
   * `matrix` contains [width, height, skewX, skewY, x, y] transformation values.
   */
  eyes: Array<{
    width: number
    height: number
    matrix: [number, number, number, number, number, number]
  }>
  /** Resolved color assignments for this layout frame. */
  colors: { body: string; eye: string; palette: string[] }
}
