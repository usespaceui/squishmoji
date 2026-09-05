import type { SquishOptions } from '../../types'
import { solidMarkup } from './solid'
import { taygetaMarkup } from './taygeta'
import { maiaMarkup } from './maia'
import { meropeMarkup } from './merope'
import { celaenoMarkup } from './celaeno'
import { alcyoneMarkup } from './alcyone'

export function backgroundMarkup(body: string, style: NonNullable<SquishOptions['backgroundStyle']>, palette: string[], uid: string, seed: number) {
  if (style === 'solid') return solidMarkup()
  const clip = `${uid}-clip`
  const defs = `<clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><path d="${body}"/></clipPath>`
  if (style === 'taygeta') return taygetaMarkup(body, palette, clip, uid, seed, defs)
  if (style === 'maia') return maiaMarkup(body, palette, clip, uid, seed, defs)
  if (style === 'merope') return meropeMarkup(body, palette, clip, uid, seed, defs)
  if (style === 'alcyone') {
    const markup = alcyoneMarkup(body, palette, clip, uid, seed)
    return { defs: defs + markup.defs, layers: markup.layers }
  }
  return celaenoMarkup(body, palette, clip, uid, seed, defs)
}

export { solidMarkup } from './solid'
export { taygetaMarkup } from './taygeta'
export { maiaMarkup } from './maia'
export { meropeMarkup } from './merope'
export { celaenoMarkup } from './celaeno'
export { alcyoneMarkup } from './alcyone'
