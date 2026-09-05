const round = (value: number) => Math.round(value * 1000) / 1000

export function capsulePath(width: number, height: number): string {
  const halfWidth = Math.max(width, 0.01) / 2
  const halfHeight = Math.max(height, 0.01) / 2
  const radius = Math.min(halfWidth, halfHeight)
  return `M${round(-halfWidth)} ${round(-halfHeight + radius)}A${round(radius)} ${round(radius)} 0 0 1 ${round(-halfWidth + radius)} ${round(-halfHeight)}L${round(halfWidth - radius)} ${round(-halfHeight)}A${round(radius)} ${round(radius)} 0 0 1 ${round(halfWidth)} ${round(-halfHeight + radius)}L${round(halfWidth)} ${round(halfHeight - radius)}A${round(radius)} ${round(radius)} 0 0 1 ${round(halfWidth - radius)} ${round(halfHeight)}L${round(-halfWidth + radius)} ${round(halfHeight)}A${round(radius)} ${round(radius)} 0 0 1 ${round(-halfWidth)} ${round(halfHeight - radius)}Z`
}

export function bodyPath(pointAt: (angle: number) => { x: number; y: number }, samples = 64): string {
  const points = Array.from({ length: samples }, (_, i) => {
    const angle = (i / samples) * Math.PI * 2
    const point = pointAt(angle)
    return { x: point.x * 100, y: point.y * 100 }
  })
  const at = (index: number) => points[(index + samples) % samples]!
  let path = `M${round(at(0).x)} ${round(at(0).y)}`
  for (let i = 0; i < samples; i++) {
    const before = at(i - 1)
    const start = at(i)
    const end = at(i + 1)
    const after = at(i + 2)
    path += `C${round(start.x + (end.x - before.x) / 6)} ${round(start.y + (end.y - before.y) / 6)} ${round(end.x - (after.x - start.x) / 6)} ${round(end.y - (after.y - start.y) / 6)} ${round(end.x)} ${round(end.y)}`
  }
  return `${path}Z`
}
