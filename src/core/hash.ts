const encoder = new TextEncoder()

export function seedNumber(input: string): number {
  let hash = 2166136261
  for (const byte of encoder.encode(input.normalize('NFC').trim().toLowerCase())) {
    hash ^= byte
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function unit(seed: number, channel: number): number {
  let value = (seed + Math.imul(channel + 1, 0x9e3779b9)) >>> 0
  value ^= value >>> 16
  value = Math.imul(value, 0x85ebca6b)
  value ^= value >>> 13
  return (value >>> 0) / 4294967296
}

export const between = (value: number, min: number, max: number) => min + (max - min) * value

export const seedState = (value: string) => seedNumber(value)
export const stream = (state: number, channel: string) => unit(seedNumber(`${state}:${channel}`), 0)
