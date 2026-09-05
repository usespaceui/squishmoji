import { generatePalette } from "@usespaceui/gradients";
import { paletteSeed, seededRandom } from "../core/rng";

const paletteCache = new Map<string, string[]>();
const PALETTE_CACHE_LIMIT = 256;

export function paletteFor(seed: string) {
  const cached = paletteCache.get(seed);
  if (cached) return cached;
  const colors = [...generatePalette(seed, { mode: "presets" }).colors].slice(
    0,
    5,
  );
  if (paletteCache.size >= PALETTE_CACHE_LIMIT) {
    const oldest = paletteCache.keys().next().value;
    if (oldest !== undefined) paletteCache.delete(oldest);
  }
  paletteCache.set(seed, colors);
  return colors;
}

export function solidIndexFor(seed: string) {
  const colors = paletteFor(seed);
  return Math.min(
    colors.length - 1,
    Math.floor(seededRandom(paletteSeed(seed))() * colors.length),
  );
}

export function solidColorFor(seed: string) {
  const colors = paletteFor(seed);
  return colors[solidIndexFor(seed)] ?? "#6b5cff";
}

export function colorsFor(seed: string) {
  const colors = paletteFor(seed);
  return {
    body: colors[solidIndexFor(seed)] ?? "#6b5cff",
    eye: "#fff",
    palette: colors,
  };
}

export const avatarPalette = (seed = "avatar") => paletteFor(seed);
