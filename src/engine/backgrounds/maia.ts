import { bloomMarkup } from './bloom'

export function maiaMarkup(body: string, palette: string[], clip: string, uid: string, seed: number, defs: string) {
  return bloomMarkup(body, palette, clip, uid, seed ^ 0x4d414941, defs, 'maia', {
    count: [8, 12], spread: 0.48, size: [0.2, 0.44], blur: 2.8, focus: 20, highlight: 0.28, colorOffset: 1,
  })
}
