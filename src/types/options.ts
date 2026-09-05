import type {
  SquishShape,
  SquishExpression,
  SquishBackgroundStyle,
  SquishShapeChoice,
  SquishExpressionChoice,
  SquishBackgroundStyleChoice,
} from './catalog'
import type { SquishLayout } from './layout'

/** Default deterministic seed used across Space UI avatar libraries. */
export const DEFAULT_SEED = 'Space UI'

/**
 * Output format supported by createAvatar.
 */
export const SquishOutputFormat = {
  svg: 'svg',
  json: 'json',
} as const

export type SquishOutputFormat = (typeof SquishOutputFormat)[keyof typeof SquishOutputFormat]

/** Alias for compatibility with @usespaceui/avatars */
export const AvatarOutputFormat = SquishOutputFormat
export type AvatarOutputFormat = SquishOutputFormat

/**
 * Structured JSON representation of a generated squishmoji.
 */
export interface SquishJson {
  /** Deterministic identity seed. */
  seed: string
  /** Physical shape profile. */
  shape: SquishShape
  /** Facial expression of the avatar. */
  expression: SquishExpression
  /** Rendered size in pixels if specified. */
  size?: number
  /** Applied background style. */
  backgroundStyle: SquishBackgroundStyle
  /** Complete standalone SVG markup. */
  svg: string
  /** Ready-to-use Data URI string. */
  dataUri: string
  /** Calculated internal geometric layout data. */
  layout: SquishLayout
}

/** Alias for compatibility with @usespaceui/avatars */
export type AvatarJson = SquishJson

/**
 * Options used to customize the deterministic generation of a squishmoji.
 */
export interface SquishOptions {
  /** Deterministic avatar identity seed (used when passing a single options object). */
  seed?: string
  /** The size in pixels of the rendered avatar SVG (width and height). */
  size?: number
  /** Shape id, or `"all"` to pick deterministically from the seed. Defaults to circle. */
  shape?: SquishShapeChoice
  /** Expression id, or `"all"` to pick deterministically from the seed. Defaults to neutral. */
  expression?: SquishExpressionChoice
  /** Background style, or `"all"` to pick deterministically from the seed. Defaults to solid. */
  backgroundStyle?: SquishBackgroundStyleChoice
  /** Output format ("svg" or "json"). Defaults to "svg". */
  format?: SquishOutputFormat | 'svg' | 'json'
}
