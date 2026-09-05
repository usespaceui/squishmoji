import {
  blendExpression,
  expressionPose,
  type ExpressionPose,
} from "./expressions";
import { buildLayout } from "./layout";
import { renderLayout } from "../core/render";
import { blendGeometry, shapeGeometry, type ShapeGeometry } from "./shapes";
import { traitsFor, type FittedEye } from "./face";
import { resolveExpression, resolveShape } from "../core/resolve";
import {
  DEFAULT_EXPRESSION,
  DEFAULT_SHAPE,
  type SquishExpression,
  type SquishLayout,
  type SquishOptions,
  type SquishShape,
} from "../types";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => 1 - (1 - clamp01(value)) ** 4;

interface Transition<T> {
  from: T;
  to: T;
  started: number;
  duration: number;
}

/**
 * Core engine orchestrating the smooth procedural transitions between
 * body shapes and facial expressions.
 * Maintains internal temporal state for geometry blending.
 */
export class SquishEngine {
  public name: string;
  readonly options: Omit<SquishOptions, "shape" | "expression">;
  private shape: SquishShape = DEFAULT_SHAPE;
  private expression: SquishExpression = DEFAULT_EXPRESSION;
  private shapeChange: Transition<ShapeGeometry> | null = null;
  private expressionChange: Transition<ExpressionPose> | null = null;
  private traitsName = "";
  private traits: ReturnType<typeof traitsFor> | null = null;

  constructor(name: string, options: SquishOptions = {}) {
    this.name = name;
    this.shape = resolveShape(name, options.shape);
    this.expression = resolveExpression(name, options.expression);
    const {
      shape: _shape,
      expression: _expression,
      ...renderOptions
    } = options;
    this.options = renderOptions;
  }

  isShapeBusy(time: number) {
    const change = this.shapeChange;
    if (!change) return false;
    if (time >= change.started + change.duration) {
      this.shapeChange = null;
      return false;
    }
    return true;
  }

  isExpressionBusy(time: number) {
    const change = this.expressionChange;
    if (!change) return false;
    if (time >= change.started + change.duration) {
      this.expressionChange = null;
      return false;
    }
    return true;
  }

  isBusy(time: number) {
    const shapeBusy = this.isShapeBusy(time);
    const expressionBusy = this.isExpressionBusy(time);
    return shapeBusy || expressionBusy;
  }

  /**
   * Triggers a smooth morph transition to a new body shape.
   * @param shape The target body shape ID.
   * @param time The starting timestamp (in seconds) of the transition.
   * @param duration Duration of the transition in seconds (default 0.45s).
   */
  setShape(shape: SquishShape, time: number, duration = 0.45) {
    if (shape === this.shape) {
      if (duration === 0) this.shapeChange = null;
      return;
    }
    const base = this.baseTraits();
    this.shapeChange = {
      from: this.shapeAt(time),
      to: shapeGeometry(base, shape),
      started: time,
      duration,
    };
    this.shape = shape;
  }

  /**
   * Triggers a smooth morph transition to a new facial expression.
   * @param expression The target expression ID.
   * @param time The starting timestamp (in seconds) of the transition.
   * @param duration Duration of the transition in seconds (default 0.28s).
   */
  setExpression(expression: SquishExpression, time: number, duration = 0.28) {
    if (expression === this.expression) {
      if (duration === 0) this.expressionChange = null;
      return;
    }
    this.expressionChange = {
      from: this.expressionAt(time),
      to: expressionPose(expression),
      started: time,
      duration,
    };
    this.expression = expression;
  }

  /**
   * Evaluates and returns the resolved geometric layout at a specific point in time.
   * Blends shapes and expressions seamlessly based on recent transitions.
   *
   * @param time Current timestamp in seconds.
   * @param adjustEyes Optional callback to inject custom procedural logic (like gaze tracking or blinking) into the eye matrices.
   */
  layout(
    time: number,
    adjustEyes?: (eyes: FittedEye[]) => FittedEye[],
  ): SquishLayout {
    const shape = this.shapeAt(time);
    const expression = this.expressionAt(time);
    return buildLayout(this.name, shape, expression, adjustEyes);
  }

  /**
   * Directly samples and renders an SVG string of the avatar at a specific time.
   */
  sample(time: number, options: { size?: number } = {}) {
    return renderLayout(this.layout(time), { ...this.options, ...options });
  }

  private baseTraits() {
    if (this.traits && this.traitsName === this.name) return this.traits;
    this.traitsName = this.name;
    this.traits = traitsFor(this.name);
    return this.traits;
  }

  private shapeAt(time: number): ShapeGeometry {
    const change = this.shapeChange;
    if (!change || time >= change.started + change.duration) {
      if (change) this.shapeChange = null;
      return shapeGeometry(this.baseTraits(), this.shape);
    }
    const amount = ease((time - change.started) / change.duration);
    return blendGeometry(change.from, change.to, amount);
  }

  private expressionAt(time: number): ExpressionPose {
    const change = this.expressionChange;
    if (!change || time >= change.started + change.duration) {
      if (change) this.expressionChange = null;
      return expressionPose(this.expression);
    }
    return blendExpression(
      change.from,
      change.to,
      ease((time - change.started) / change.duration),
    );
  }
}
