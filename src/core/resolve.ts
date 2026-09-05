import { seedNumber } from "./hash";
import {
  BACKGROUND_STYLE_VALUES,
  DEFAULT_BACKGROUND_STYLE,
  DEFAULT_EXPRESSION,
  DEFAULT_SHAPE,
  EXPRESSION_VALUES,
  SHAPE_VALUES,
  type SquishBackgroundStyle,
  type SquishBackgroundStyleChoice,
  type SquishExpression,
  type SquishExpressionChoice,
  type SquishShape,
  type SquishShapeChoice,
} from "../types";

function pickFromPool<T extends string>(
  seed: string,
  channel: string,
  pool: readonly T[],
): T {
  return pool[seedNumber(`${seed}|${channel}`) % pool.length]!;
}

function resolveFromPool<T extends string>(
  seed: string,
  value: string | undefined,
  pool: readonly T[],
  fallback: T,
  channel: string,
  label: string,
): T {
  if (!value) return fallback;
  const lower = value.trim().toLowerCase() as T;
  if (pool.includes(lower)) return lower;
  if (lower === "all") return pickFromPool(seed, channel, pool);
  throw new RangeError(`Unknown ${label}: ${value}`);
}

export function resolveShape(
  seed: string,
  shape?: SquishShapeChoice | string,
): SquishShape {
  return resolveFromPool(
    seed,
    shape,
    SHAPE_VALUES,
    DEFAULT_SHAPE,
    "shape-picker",
    "shape",
  );
}

export function resolveExpression(
  seed: string,
  expression?: SquishExpressionChoice | string,
): SquishExpression {
  return resolveFromPool(
    seed,
    expression,
    EXPRESSION_VALUES,
    DEFAULT_EXPRESSION,
    "expression-picker",
    "expression",
  );
}

export function resolveBackgroundStyle(
  seed: string,
  backgroundStyle?: SquishBackgroundStyleChoice | string,
): SquishBackgroundStyle {
  return resolveFromPool(
    seed,
    backgroundStyle,
    BACKGROUND_STYLE_VALUES,
    DEFAULT_BACKGROUND_STYLE,
    "background-picker",
    "background style",
  );
}
