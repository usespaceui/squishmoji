import type { SquishExpression } from '../types'

/**
 * Represents an SVG transformation matrix for a single eye.
 * Format: `[scaleX, skewY, skewX, scaleY, translateX, translateY]`
 */
export type EyeMatrix = [number, number, number, number, number, number]

/**
 * Geometric properties for a single eye in an expression.
 */
export interface EyeExpression {
  width: number
  height: number
  matrix: EyeMatrix
}

/**
 * Geometric data for a full facial expression (both eyes).
 */
export interface ExpressionPose {
  left: EyeExpression
  right: EyeExpression
}

const eye = (width: number, height: number, matrix: EyeMatrix): EyeExpression => ({ width, height, matrix })
const pair = (width: number, height: number, left: EyeMatrix, right: EyeMatrix): ExpressionPose => ({
  left: eye(width, height, left),
  right: eye(width, height, right)
})

const POSES: Record<SquishExpression, ExpressionPose> = {
  neutral: pair(18.6, 41.2, [0.96, -0.19, 0.15, 0.97, 20.09, 13.81], [0.71, -0.24, 0.15, 0.97, 59.83, 3.56]),
  attentive: pair(21, 44, [0.98, -0.09, 0.08, 0.99, -17.03, -5.48], [0.94, -0.04, 0.08, 0.99, 29.57, -8.71]),
  surprised: pair(45, 47, [0.96, 0.02, 0, 1, -22.45, 4.18], [0.93, -0.02, 0, 1, 32.93, 4.29]),
  excited: pair(40, 56, [0.96, -0.09, 0.14, 0.97, -19.32, 19.29], [0.88, 0.09, -0.18, 0.97, 37.45, 19.69]),
  happy: pair(27, 17, [0.95, 0.19, -0.22, 0.97, -17.45, -12.93], [0.89, -0.19, 0.24, 0.97, 32.18, -12.61]),
  laughing: pair(34, 13, [0.92, 0.26, -0.31, 0.94, -20.58, -19.98], [0.86, -0.26, 0.33, 0.94, 31.81, -19.23]),
  angry: pair(34, 15, [0.84, 0.46, -0.48, 0.88, -20.17, -9.98], [0.81, -0.46, 0.48, 0.88, 29.57, -9.85]),
  sad: pair(22, 40, [0.87, -0.4, 0.45, 0.89, -18.47, 18.29], [0.83, 0.4, -0.45, 0.89, 28.51, 18.63]),
  scared: pair(40, 60, [0.95, 0.12, -0.01, 0.94, -26.36, 27.11], [0.92, -0.12, -0.01, 0.94, 33.25, 27.52]),
  suspicious: { left: eye(21, 40, [0.99, -0.13, 0.13, 0.99, -5.34, -6.24]), right: eye(22, 15, [0.87, -0.07, 0.13, 0.99, 40.23, -10.95]) },
  confused: { left: eye(20, 44, [0.86, -0.19, 0.12, 0.98, -42.05, -7.56]), right: eye(28, 17, [0.92, 0.38, -0.38, 0.92, 4.11, -0.88]) },
  curious: { left: eye(24, 46, [0.94, -0.33, 0.34, 0.92, 0.16, 18.95]), right: eye(20, 38, [0.78, -0.42, 0.32, 0.91, 46.13, 6.7]) },
  proud: pair(30, 15, [0.94, 0.24, -0.28, 0.95, -17.65, -18.7], [0.87, -0.24, 0.31, 0.95, 31.84, -18.01]),
  shy: pair(17, 30, [0.83, -0.06, 0.19, 0.96, -43.99, 22.11], [0.98, -0.17, 0.19, 0.96, -6.34, 17.56]),
  bored: pair(30, 12, [0.79, -0.01, -0.01, 1, -51.24, -2.79], [1, 0.01, -0.01, 1, -8.25, -2.84]),
  sleepy: pair(20, 42, [0.98, 0, 0.04, 0.45, -14.11, 13.93], [0.93, -0.04, 0.04, 0.45, 32.84, 11.77]),
  crazy: { left: eye(45, 45, [0.88, 0.33, -0.33, 0.94, -27.88, -4.99]), right: eye(20, 20, [0.94, -0.1, 0.07, 0.99, 29.7, 5.15]) },
  loving: pair(50, 55, [0.95, 0.06, 0, 0.98, -22.5, 16.65], [0.95, -0.06, 0, 0.98, 24.3, 17.04]),
  determined: pair(28, 18, [0.93, -0.29, 0.25, 0.95, -23.03, -11.46], [0.93, 0.29, -0.25, 0.95, 23.83, -11.23]),
  guilty: pair(22, 22, [1, 0, -0.03, 0.96, -7.54, -23.52], [0.88, 0.16, -0.03, 0.96, 40.87, -18.75]),
  amazed: pair(55, 55, [0.94, 0.03, 0, 1, -28, 6.89], [0.94, -0.03, 0, 1, 30.16, 7.1]),
  doubtful: { left: eye(25, 15, [0.91, 0.14, -0.12, 0.99, -33.45, 1.84]), right: eye(40, 40, [0.96, -0.15, 0.15, 0.99, 18.39, -1.82]) }
}

/**
 * Returns the transformation data for a given expression.
 */
export const expressionPose = (expression: SquishExpression) =>
  POSES[expression] ?? POSES.neutral

export function blendExpression(from: ExpressionPose, to: ExpressionPose, amount: number): ExpressionPose {
  const mix = (a: number, b: number) => a + (b - a) * amount
  const mixEye = (a: EyeExpression, b: EyeExpression): EyeExpression => ({
    width: mix(a.width, b.width),
    height: mix(a.height, b.height),
    matrix: a.matrix.map((value, index) => mix(value, b.matrix[index]!)) as EyeMatrix
  })
  return { left: mixEye(from.left, to.left), right: mixEye(from.right, to.right) }
}
