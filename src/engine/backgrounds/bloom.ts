import { createRng } from '../../core/rng'
import { format } from '../../core/svg'

export type BloomProfile = {
  count: [number, number]
  spread: number
  size: [number, number]
  blur: number
  focus: number
  highlight: number
  colorOffset: number
}

export function bloomMarkup(body: string, palette: string[], clip: string, uid: string, seed: number, defs: string, name: string, profile: BloomProfile) {
  const random = createRng(seed)
  const colors = [palette[1], palette[2], palette[3], palette[4]].filter(Boolean)
  const spots: string[] = []
  const gradients: string[] = []
  const scale = 316 / 64
  const count = profile.count[0] + Math.floor(random.next() * (profile.count[1] - profile.count[0] + 1))

  for (let index = 0; index < count; index++) {
    const baseAngle = random.next() * 360
    const distance = random.next() * 64 * profile.spread
    const radius = 64 * (profile.size[0] + random.next() * (profile.size[1] - profile.size[0])) * scale
    const angle = baseAngle * Math.PI / 180
    const x = (Math.cos(angle) * distance + (random.next() - 0.5) * 19.2) * scale
    const y = (Math.sin(angle) * distance + (random.next() - 0.5) * 19.2) * scale
    const gradientRadians = (random.next() * 360 - 90) * Math.PI / 180
    const gradientId = `${uid}-${name}-${index}`
    const color = colors[(index + profile.colorOffset) % colors.length]
    gradients.push(`<radialGradient id="${gradientId}" cx="${format(50 + Math.cos(gradientRadians) * profile.focus)}%" cy="${format(50 + Math.sin(gradientRadians) * profile.focus)}%" r="75%"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`)
    spots.push(`<circle cx="${format(x)}" cy="${format(y)}" r="${format(radius)}" fill="url(#${gradientId})"/>`)
  }

  const highlightId = `${uid}-${name}-highlight`
  gradients.push(`<radialGradient id="${highlightId}" cx="34%" cy="26%" r="76%"><stop offset="0" stop-color="#ffffff" stop-opacity="${profile.highlight}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>`)
  spots.push(`<circle cx="0" cy="0" r="${format(32 * scale)}" fill="url(#${highlightId})" style="mix-blend-mode:plus-lighter"/>`)
  const blurId = `${uid}-${name}-soft`
  const filter = `<filter id="${blurId}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${format(profile.blur * scale)}"/></filter>`
  return { defs: `${defs}${filter}${gradients.join('')}`, layers: `<g clip-path="url(#${clip})"><path d="${body}" fill="${palette[0]}"/><g filter="url(#${blurId})" clip-path="url(#${clip})">${spots.join('')}</g></g>` }
}
