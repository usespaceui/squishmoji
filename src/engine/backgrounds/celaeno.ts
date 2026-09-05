import { createRng } from '../../core/rng'
import { format } from '../../core/svg'

export function celaenoMarkup(body: string, palette: string[], clip: string, uid: string, seed: number, defs: string) {
  const [core, glow, blobA] = [...palette, '#ffffff', '#ffffff', '#ffffff']
  const random = createRng(seed)
  const scale = 316 / 64
  const innerX = random.jit(0, 5) * scale
  const innerY = random.jit(-17.1, 5) * scale
  const innerRotate = random.jit(180, 20)
  const innerBlur = random.range(4, 7)
  const glowX = random.jit(0, 5) * scale
  const glowY = random.jit(-28.4, 5) * scale
  const glowRotate = random.jit(180, 20)
  const glowBlur = random.range(7, 10)
  const innerFilter = `${uid}-celaeno-inner`
  const glowFilter = `${uid}-celaeno-glow`
  const celaenoDefs = `${defs}<filter id="${innerFilter}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${format(innerBlur * scale)}"/></filter><filter id="${glowFilter}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${format(glowBlur * scale)}"/></filter>`
  const base = `<path d="${body}" fill="${glow}"/>`
  const inner = `<rect x="${format(innerX - 42.5 * scale)}" y="${format(innerY - 47.5 * scale)}" width="${format(85 * scale)}" height="${format(95 * scale)}" rx="${format(47.5 * scale)}" fill="${core}" filter="url(#${innerFilter})" transform="rotate(${format(innerRotate)} ${format(innerX)} ${format(innerY)})"/>`
  const glowLayer = `<rect x="${format(glowX - 35 * scale)}" y="${format(glowY - 37.5 * scale)}" width="${format(70 * scale)}" height="${format(75 * scale)}" rx="${format(25.3 * scale)}" fill="${blobA}" filter="url(#${glowFilter})" transform="rotate(${format(glowRotate)} ${format(glowX)} ${format(glowY)})"/>`
  return { defs: celaenoDefs, layers: `<g clip-path="url(#${clip})">${base}${inner}${glowLayer}</g>` }
}
