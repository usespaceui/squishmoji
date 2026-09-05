import { createPebbleRandom } from '../../core/rng'
import { format } from '../../core/svg'

export function alcyoneMarkup(body: string, palette: string[], clip: string, uid: string, seed: number) {
  const random = createPebbleRandom(seed)
  const colors = [...palette]
  if (random() > 0.5) colors.reverse()
  random()
  random()
  random()
  const scale = 316 / 200
  const map = (value: number) => (value - 100) * scale
  const blobs = [
    { cx: 40 + random() * 50, cy: 40 + random() * 50, rx: 70 + random() * 40, ry: 70 + random() * 40 },
    { cx: 110 + random() * 50, cy: 60 + random() * 40, rx: 60 + random() * 45, ry: 60 + random() * 45 },
    { cx: 60 + random() * 80, cy: 140 + random() * 40, rx: 70 + random() * 40, ry: 60 + random() * 40 },
  ]
  const grain = random() > 0.45
  const tilt = random() * 16 - 8
  const blurId = `${uid}-alcyone-soft`
  const grainId = `${uid}-alcyone-grain`
  const fill = colors[0] ?? '#6b5cff'
  const defs = `<filter id="${blurId}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${format(26 * scale)}"/></filter><filter id="${grainId}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/><feColorMatrix type="saturate" values="0"/></filter>`
  const shapes = blobs
    .map((blob, index) => `<ellipse cx="${format(map(blob.cx))}" cy="${format(map(blob.cy))}" rx="${format(blob.rx * scale)}" ry="${format(blob.ry * scale)}" fill="${colors[index] ?? fill}"/>`)
    .join('')
  const grainLayer = grain ? `<rect x="-158" y="-158" width="316" height="316" filter="url(#${grainId})" opacity="0.16"/>` : ''
  const layers = `<g clip-path="url(#${clip})"><path d="${body}" fill="${fill}"/><g filter="url(#${blurId})" transform="rotate(${format(tilt)} 0 0)"><rect x="-220" y="-220" width="440" height="440" fill="${fill}"/>${shapes}</g>${grainLayer}</g>`
  return { defs, layers }
}
