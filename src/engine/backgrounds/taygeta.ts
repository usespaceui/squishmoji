import { bloomMarkup } from './bloom'

export function taygetaMarkup(body: string, palette: string[], clip: string, uid: string, seed: number, defs: string) {
  return bloomMarkup(body, palette, clip, uid, seed, defs, 'taygeta', {
    count: [12, 17], spread: 0.6, size: [0.1, 0.35], blur: 2, focus: 28, highlight: 0.15, colorOffset: 0,
  })
}
