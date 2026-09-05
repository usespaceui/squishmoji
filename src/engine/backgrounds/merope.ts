import { bloomMarkup } from './bloom'

export function meropeMarkup(body: string, palette: string[], clip: string, uid: string, seed: number, defs: string) {
  return bloomMarkup(body, palette, clip, uid, seed ^ 0x4d45524f, defs, 'merope', {
    count: [16, 22], spread: 0.72, size: [0.08, 0.24], blur: 3.6, focus: 34, highlight: 0.1, colorOffset: 2,
  })
}
