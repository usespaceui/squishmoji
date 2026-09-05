import React, {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SquishEngine } from "../engine/animation";
import { renderLayout } from "../core/render";
import { resolveExpression, resolveShape } from "../core/resolve";
import {
  DEFAULT_BACKGROUND_STYLE,
  DEFAULT_EXPRESSION,
  DEFAULT_SEED,
  DEFAULT_SHAPE,
  EXPRESSIONS,
  type SquishBackgroundStyleChoice,
  type SquishExpression,
  type SquishExpressionChoice,
  type SquishLayout,
  type SquishShapeChoice,
} from "../types";

/**
 * Properties for configuring the React Squishmoji component.
 */
export interface AvatarProps {
  /** Width and height of the SVG. Defaults to `120`. */
  size?: number | string;
  /** Deterministic seed string generating the avatar's core geometry and palette. Defaults to `DEFAULT_SEED` ("Space UI"). */
  seed?: string;
  /** Body shape, or `"all"` to pick deterministically from the seed. Defaults to `circle`. */
  shape?: SquishShapeChoice;
  /** Facial expression, or `"all"` to pick deterministically from the seed. Defaults to `neutral`. */
  expression?: SquishExpressionChoice;
  /** Freezes the avatar animation at a specific time in seconds (useful for SSR or static rendering). */
  frozenAt?: number;
  /** Enables an interactive click animation (temporarily changes expression). */
  animOnClick?: boolean;
  /** Enables an interactive hover animation (temporarily changes expression). */
  animOnHover?: boolean;
  /** Vertical gaze offset adjustment. */
  gazeOffsetY?: number;
  /** Cross-eyed or divergent split eye offset. */
  splitOffset?: number;
  /** Size multiplier applied to the eyes. */
  eyeScale?: number;
  /** Multiplier for the automatic gaze drift range. Set to 0 to lock eyes forward. */
  gazeRange?: number;
  /** Background style, or `"all"` to pick deterministically from the seed. Defaults to `solid`. */
  backgroundStyle?: SquishBackgroundStyleChoice;
  /** Whether the avatar breathes and drifts its gaze. Defaults to `true`. */
  animate?: boolean;
  /** Adds a gentle floating CSS transform effect. Defaults to `false`. */
  animWobble?: boolean;
  /** A changing numeric trigger that forces a manual blink when updated. */
  blinkTrigger?: number;
  /** Optional CSS class applied to the host element. */
  className?: string;
  /** Optional styles merged onto the host element. */
  style?: React.CSSProperties;
}

export const DEFAULT_VALUE = {
  size: 120,
  seed: DEFAULT_SEED,
  shape: DEFAULT_SHAPE,
  expression: DEFAULT_EXPRESSION,
  frozenAt: undefined as number | undefined,
  animOnClick: false,
  animOnHover: false,
  gazeOffsetY: 0,
  splitOffset: 0,
  eyeScale: 1,
  gazeRange: 1,
  backgroundStyle: DEFAULT_BACKGROUND_STYLE,
  animate: true,
  animWobble: false,
  blinkTrigger: 0,
} as const;

const now = () => performance.now() / 1000;

type Eye = SquishLayout["eyes"][number];

function AvatarComponent({
  size = DEFAULT_VALUE.size,
  seed = DEFAULT_VALUE.seed,
  shape = DEFAULT_VALUE.shape,
  expression = DEFAULT_VALUE.expression,
  frozenAt = DEFAULT_VALUE.frozenAt,
  animOnClick = DEFAULT_VALUE.animOnClick,
  animOnHover = DEFAULT_VALUE.animOnHover,
  gazeOffsetY = DEFAULT_VALUE.gazeOffsetY,
  splitOffset = DEFAULT_VALUE.splitOffset,
  eyeScale = DEFAULT_VALUE.eyeScale,
  gazeRange = DEFAULT_VALUE.gazeRange,
  backgroundStyle = DEFAULT_VALUE.backgroundStyle,
  animate = DEFAULT_VALUE.animate,
  animWobble = DEFAULT_VALUE.animWobble,
  blinkTrigger = DEFAULT_VALUE.blinkTrigger,
  className,
  style,
}: AvatarProps) {
  const isLive = frozenAt === undefined;
  const resolvedShape = resolveShape(seed, shape);
  const resolvedStartExpression = resolveExpression(seed, expression);
  const engineRef = useRef<SquishEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new SquishEngine(seed, {
      shape: resolvedShape,
      expression: resolvedStartExpression,
    });
  }
  const engine = engineRef.current;
  const [clickOverride, setClickOverride] = useState<SquishExpression | null>(
    null,
  );
  const [hoverOverride, setHoverOverride] = useState<SquishExpression | null>(
    null,
  );
  const [frameTime, setFrameTime] = useState(frozenAt ?? 0);
  const blinkAt = useRef(Number.NEGATIVE_INFINITY);
  const clickRestore = useRef<number | null>(null);
  const clickExpression = useRef<SquishExpression | null>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const liveMotion = isLive && animate && !reducedMotion;
  const activeExpression = clickOverride ?? hoverOverride ?? expression;
  const resolvedExpression = resolveExpression(seed, activeExpression);

  useLayoutEffect(() => {
    engine.name = seed;
    engine.setShape(resolvedShape, isLive ? now() : -100, isLive ? 0.45 : 0);
    engine.setExpression(
      resolvedExpression,
      isLive ? now() : -100,
      isLive ? 0.28 : 0,
    );
  }, [engine, seed, resolvedShape, resolvedExpression, isLive]);

  useEffect(() => {
    if (!animOnHover) setHoverOverride(null);
  }, [animOnHover]);

  useEffect(() => {
    if (blinkTrigger > 0 && isLive) blinkAt.current = now();
  }, [blinkTrigger, isLive]);

  useEffect(
    () => () => {
      if (clickRestore.current != null)
        window.clearTimeout(clickRestore.current);
    },
    [],
  );

  useEffect(() => {
    if (!isLive) {
      setFrameTime(frozenAt ?? 0);
      return;
    }
    let frame = 0;
    const tick = () => {
      setFrameTime(now());
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [frozenAt, isLive]);

  const { lid } = (() => {
    const phase = liveMotion ? (frameTime + 1.35) % 4.7 : 0;
    const autoLid =
      !liveMotion || phase > 0.18
        ? 1
        : Math.max(0.035, Math.abs(phase / 0.09 - 1));
    const blinkProgress = isLive
      ? Math.min(1, Math.max(0, (frameTime - blinkAt.current) / 0.2))
      : 1;
    const manualLid =
      blinkProgress < 1 ? Math.max(0.035, Math.abs(blinkProgress * 2 - 1)) : 1;
    return { lid: Math.min(autoLid, manualLid) };
  })();
  const drift = liveMotion
    ? {
        x: Math.sin(frameTime * 0.64 + 0.8) * 12.4 * gazeRange,
        y: Math.sin(frameTime * 0.43 + 2.2) * 9.6 * gazeRange,
      }
    : { x: 0, y: 0 };

  const layout = engine.layout(frameTime, (eyes) =>
    eyes.map((eye, index) => {
      const matrix = [...eye.matrix] as Eye["matrix"];
      matrix[3] *= lid;
      matrix[4] += drift.x + (index === 0 ? -splitOffset : splitOffset);
      matrix[5] += drift.y + gazeOffsetY;
      return {
        ...eye,
        width: eye.width * eyeScale,
        height: eye.height * eyeScale,
        matrix,
      };
    }),
  );

  const wobble =
    animWobble && liveMotion
      ? `translate(${Math.sin(frameTime * 1.7) * 1.5}px, ${Math.cos(frameTime * 1.3) * 1.5}px) rotate(${Math.sin(frameTime) * 0.45}deg)`
      : undefined;
  let svg = renderLayout(layout, {
    seed,
    backgroundStyle,
    ...(typeof size === "number" ? { size } : {}),
  });
  if (typeof size === "string") {
    svg = svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
  }
  if (wobble) {
    svg = svg.replace(
      'style="overflow:visible"',
      `style="overflow:visible;transform:${wobble}"`,
    );
  }

  const click = () => {
    if (!animOnClick) return;
    if (clickRestore.current) window.clearTimeout(clickRestore.current);
    const visible = clickExpression.current ?? hoverOverride ?? expression;
    const next =
      visible === EXPRESSIONS.angry ? EXPRESSIONS.excited : EXPRESSIONS.angry;
    clickExpression.current = next;
    setClickOverride(next);
    clickRestore.current = window.setTimeout(() => {
      clickExpression.current = null;
      setClickOverride(null);
      clickRestore.current = null;
    }, 1500);
  };

  const enter = () => {
    if (!animOnHover) return;
    const visible = clickExpression.current ?? expression;
    setHoverOverride(
      visible === EXPRESSIONS.surprised
        ? EXPRESSIONS.loving
        : EXPRESSIONS.surprised,
    );
  };

  const leave = () => setHoverOverride(null);

  return (
    <span
      className={className}
      style={{
        display: "inline-block",
        lineHeight: 0,
        cursor: animOnClick ? "pointer" : undefined,
        ...style,
      }}
      onClick={click}
      onPointerEnter={enter}
      onPointerLeave={leave}
    >
      <span
        style={{ display: "block", pointerEvents: "none" }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </span>
  );
}

export const Avatar = memo(AvatarComponent);
