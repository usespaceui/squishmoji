export function paletteSeed(input: string) {
  let hash = 2166136261 >>> 0
  for (let index = 0; index < input.length; index++) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  hash ^= hash >>> 16
  hash = Math.imul(hash, 0x7feb352d) >>> 0
  hash ^= hash >>> 15
  hash = Math.imul(hash, 0x846ca68b) >>> 0
  hash ^= hash >>> 16
  return hash >>> 0
}

export function seededRandom(seed: number) {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed: number) {
  let state = seed ^ 0x9e3779b9
  state = Math.imul(state ^ (state >>> 16), 0x45d9f3b) >>> 0
  state = Math.imul(state ^ (state >>> 16), 0x45d9f3b) >>> 0
  state = (state ^ (state >>> 16)) >>> 0
  const next = () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
  const range = (min: number, max: number) => min + next() * (max - min)
  return {
    next,
    range,
    jit: (value: number, amount: number) => value + range(-amount, amount),
  }
}

export function createPebbleRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}
