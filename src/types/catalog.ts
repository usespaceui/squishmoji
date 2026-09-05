/**
 * Complete list of available base shapes for the avatar body.
 * These act as deterministic seeds for the procedural geometry.
 */
export const SHAPES = {
  circle: "circle",
  pebble: "pebble",
  squircle: "squircle",
  capsule: "capsule",
  triangle: "triangle",
  hexagon: "hexagon",
  cloud: "cloud",
  drop: "drop",
  square: "square",
  pentagon: "pentagon",
  octagon: "octagon",
  star: "star",
  cat: "cat",
  ghost: "ghost",
  ufo: "ufo",
  flower: "flower",
  bot: "bot",
  alien: "alien",
  lion: "lion",
  monkey: "monkey",
  mecha: "mecha",
} as const;

/**
 * Complete list of available emotional expressions.
 * Each expression maps to a specific facial feature transformation matrix.
 */
export const EXPRESSIONS = {
  neutral: "neutral",
  attentive: "attentive",
  surprised: "surprised",
  excited: "excited",
  happy: "happy",
  laughing: "laughing",
  angry: "angry",
  sad: "sad",
  scared: "scared",
  suspicious: "suspicious",
  confused: "confused",
  curious: "curious",
  proud: "proud",
  shy: "shy",
  bored: "bored",
  sleepy: "sleepy",
  crazy: "crazy",
  loving: "loving",
  determined: "determined",
  guilty: "guilty",
  amazed: "amazed",
  doubtful: "doubtful",
} as const;

/**
 * Complete list of available generative background styles.
 * Solid renders a flat color, while others render generative SVG particle/bloom effects.
 */
export const BACKGROUND_STYLES = {
  solid: "solid",
  taygeta: "taygeta",
  maia: "maia",
  merope: "merope",
  celaeno: "celaeno",
  alcyone: "alcyone",
} as const;

/** Ordered values kept for the demo controls and public catalog consumers. */
export const SHAPE_LIST = Object.values(SHAPES).map((id) => ({ id }));
export const EXPRESSION_LIST = Object.values(EXPRESSIONS).map((id) => ({ id }));
export const BACKGROUND_STYLE_LIST = Object.values(BACKGROUND_STYLES);

export const SHAPE_VALUES = Object.values(SHAPES);
export const EXPRESSION_VALUES = Object.values(EXPRESSIONS);
export const BACKGROUND_STYLE_VALUES = Object.values(BACKGROUND_STYLES);

export const DEFAULT_SHAPE = SHAPES.circle;
export const DEFAULT_EXPRESSION = EXPRESSIONS.neutral;
export const DEFAULT_BACKGROUND_STYLE = BACKGROUND_STYLES.solid;

/**
 * Valid types for the avatar rendering.
 */
export type SquishBackgroundStyle = keyof typeof BACKGROUND_STYLES;
export type SquishExpression = keyof typeof EXPRESSIONS;
export type SquishShape = keyof typeof SHAPES;
export type SquishCatalogPick = "all";
export type SquishShapeChoice = SquishShape | SquishCatalogPick;
export type SquishExpressionChoice = SquishExpression | SquishCatalogPick;
export type SquishBackgroundStyleChoice =
  | SquishBackgroundStyle
  | SquishCatalogPick;
