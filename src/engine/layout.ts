import { colorsFor } from "../palette";
import { paletteSeed } from "../core/rng";
import { bodyPath } from "../core/geometry";
import { resolveExpression, resolveShape } from "../core/resolve";
import { traitsFor, fitEyesToShape, type FittedEye } from "./face";
import { shapeGeometry, type ShapeGeometry } from "./shapes";
import { expressionPose, type ExpressionPose } from "./expressions";
import { type SquishLayout, type SquishOptions } from "../types";

export function resolveLayout(
  name: string,
  options: SquishOptions = {},
): SquishLayout {
  const base = traitsFor(name);
  return buildLayout(
    name,
    shapeGeometry(base, resolveShape(name, options.shape)),
    expressionPose(resolveExpression(name, options.expression)),
  );
}

export function buildLayout(
  name: string,
  geometry: ShapeGeometry,
  expression: ExpressionPose,
  adjustEyes?: (eyes: FittedEye[]) => FittedEye[],
): SquishLayout {
  const traits = geometry.traits;
  const colors = colorsFor(name);
  const eyes = [-1, 1].map((_, index) => {
    const pose = index === 0 ? expression.left : expression.right;
    const other = index === 0 ? expression.right : expression.left;
    const center = (pose.matrix[4] + other.matrix[4]) / 2;
    const matrix = [...pose.matrix] as typeof pose.matrix;
    matrix[4] = center + (matrix[4] - center) * (traits.eyeGap / 0.49);
    matrix[5] += traits.eyeHeight * 100;
    return {
      width: traits.eyeSize * pose.width,
      height: traits.eyeSize * pose.height,
      matrix,
    };
  });
  const adjustedEyes = adjustEyes ? adjustEyes(eyes) : eyes;
  return {
    seed: paletteSeed(name),
    traits,
    body: bodyPath(geometry.point),
    eyes: fitEyesToShape(geometry, adjustedEyes),
    colors,
  };
}
