<p align="center">
  <a href="https://www.spaceui.one/tools/avatars?type=squishmoji" target="_blank">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://www.spaceui.one/logo-squishmoji.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://www.spaceui.one/logo-squishmoji.svg">
      <img alt="Space UI logo" src="https://www.spaceui.one/logo-squishmoji.svg" width="100" />
    </picture>
  </a>
</p>

<h1 align="center">
  @usespaceui/squishmoji
</h1>

<p align="center">
  Interactive, procedural squishy SVG avatars and animated emojis for React and modern web UI.
</p>

<p align="center">
  <a href="https://www.spaceui.one/tools/avatars?type=squishmoji">Preview</a> • 
  <a href="https://github.com/usespaceui/squishmoji">Source Code</a> • 
  <a href="https://www.spaceui.one">SpaceUI.one</a>
</p>

<p align="center">
  <a href="https://twitter.com/intent/follow?screen_name=usespaceui">
    <img src="https://img.shields.io/twitter/follow/usespaceui.svg?label=Follow%20@usespaceui" alt="Follow @usespaceui" />
  </a>
</p>

<div align="center">
  <a href="https://www.npmjs.com/package/@usespaceui/squishmoji">
    <img src="https://img.shields.io/npm/v/@usespaceui/squishmoji?color=%23fa6400&label=version" />
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/squishmoji">
    <img src="https://img.shields.io/npm/unpacked-size/%40usespaceui%2Fsquishmoji?label=install%20size">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/squishmoji">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Fsquishmoji?format=min">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/squishmoji">
    <img src="https://img.shields.io/bundlejs/size/%40usespaceui%2Fsquishmoji">
  </a>
  <a href="https://github.com/usespaceui/squishmoji">
    <img src="https://img.shields.io/github/repo-size/usespaceui/squishmoji">
  </a>
  <a href="https://www.npmjs.com/package/@usespaceui/squishmoji">
    <img src="https://img.shields.io/npm/dm/@usespaceui/squishmoji" />
  </a>
  <a href="https://github.com/usespaceui/squishmoji/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/@usespaceui/squishmoji" />
  </a>
  <br><br>
</div>

---

## ✨ Overview

`@usespaceui/squishmoji` is a free, lightweight React and TypeScript library that generates charming, deterministic squishy SVG avatars and emojis. Every seed creates a reproducible persona with expressive animated eyes, lifelike breathing physics, dynamic gaze tracking, and reactive interaction states.

- **100% Deterministic:** Same seed and options always produce the same layout, palette, and contours.
- **Pure SVG:** Infinitely scalable, no canvas, no remote images.
- **Alive with Motion:** Breathing, optional wobble, gaze drift, and blinks.
- **Interactive:** Optional hover and click expression reactions.
- **Core API without React:** `createAvatar` works in Node, SSR, and vanilla JS. Use `frozenAt` or `createAvatar` for static markup.

---

## 📦 Installation

```bash
pnpm add @usespaceui/squishmoji
# or
npm install @usespaceui/squishmoji
# or
yarn add @usespaceui/squishmoji
```

`@usespaceui/gradients` is installed automatically. The `/react` entry needs React 18+. The core import does not.

---

## 🚀 Usage

### React Component

You can import either `Squishmoji` or `Avatar`:

```tsx
import { Squishmoji } from '@usespaceui/squishmoji/react'

export default function UserProfile() {
  return (
    <Squishmoji
      seed="space-explorer"
      shape="cat"
      expression="loving"
      size={120}
      className="rounded-full"
      animate
      animOnClick
      animOnHover
    />
  )
}
```

Set `animate={false}` whenever static rendering or reduced motion is preferred.

### Framework-Agnostic Core API (Node.js, SSR, Vanilla JS)

Generate raw SVG markup or structured JSON data directly for server environments, API routes, or vanilla JavaScript:

```ts
import { createAvatar, resolveLayout, renderLayout, SquishOutputFormat } from '@usespaceui/squishmoji'

// 1. Generate raw SVG markup (default)
const svg = createAvatar('space-explorer', {
  shape: 'ufo',
  expression: 'amazed',
  size: 256,
  backgroundStyle: 'solid',
})

// 2. Generate structured JSON data with ready-to-use Data URI
const avatarJson = createAvatar('space-explorer', {
  shape: 'cat',
  expression: 'loving',
  format: 'json', // or SquishOutputFormat.json
})
// { seed, shape, expression, size, backgroundStyle, svg, dataUri, layout }

// 3. Two-phase layout computation and custom rendering pipeline
const layout = resolveLayout('space-explorer', {
  shape: 'ghost',
  expression: 'excited',
})
const renderedSvg = renderLayout(layout, {
  size: 256,
  backgroundStyle: 'taygeta',
})
```

---

## ⚙️ React Props

| Prop              | Type                               | Default      | Description                                                                             |
| :---------------- | :--------------------------------- | :----------- | :-------------------------------------------------------------------------------------- |
| `seed`            | `string`                           | `"Space UI"` | Deterministic identity. Drives the palette; with `"all"` it also picks catalog options. |
| `shape`           | `SquishShape` \| `"all"`           | `"circle"`   | Body silhouette, or `"all"` to pick deterministically from the seed.                    |
| `expression`      | `SquishExpression` \| `"all"`      | `"neutral"`  | Eye expression, or `"all"` to pick deterministically from the seed.                     |
| `backgroundStyle` | `SquishBackgroundStyle` \| `"all"` | `"solid"`    | Fill style, or `"all"` to pick deterministically from the seed.                         |
| `size`            | `number \| string`                 | `120`        | Width and height of the SVG.                                                            |
| `className`       | `string`                           | —            | Class on the host `span` (same pattern as `@usespaceui/avatars`).                       |
| `style`           | `CSSProperties`                    | —            | Inline styles on the host `span`.                                                       |
| `animate`         | `boolean`                          | `true`       | Enables autonomous breathing, natural gaze drift, and periodic blinking.                |
| `animWobble`      | `boolean`                          | `false`      | Adds gentle floating wobble physics transforms.                                         |
| `animOnClick`     | `boolean`                          | `false`      | Click cycles angry / excited. Off by default.                                           |
| `animOnHover`     | `boolean`                          | `false`      | Hover switches to surprised (loving if already surprised). Off by default.              |
| `gazeOffsetY`     | `number`                           | `0`          | Vertical eye offset in SVG units.                                                       |
| `splitOffset`     | `number`                           | `0`          | Horizontal split for divergent or cross-eyed looks.                                     |
| `eyeScale`        | `number`                           | `1`          | Size scale multiplier applied to the eyes.                                              |
| `gazeRange`       | `number`                           | `1`          | Multiplier for automatic gaze drift range (set to `0` to lock gaze forward).            |
| `blinkTrigger`    | `number`                           | `0`          | Numeric trigger that forces an instant blink whenever incremented.                      |
| `frozenAt`        | `number`                           | `undefined`  | Freezes animation state at a specific time in seconds (useful for SSR & previews).      |

---

## 🎨 Catalog

Pass `"all"` on `shape`, `expression`, or `backgroundStyle` to pick from the seed. Omit the prop (or pass a specific id) for the defaults below.

### Shapes (21)

`circle` • `pebble` • `squircle` • `capsule` • `triangle` • `hexagon` • `cloud` • `drop` • `square` • `pentagon` • `octagon` • `star` • `flower` • `cat` • `ghost` • `ufo` • `bot` • `alien` • `lion` • `monkey` • `mecha`

### Expressions (22)

`neutral` • `happy` • `sad` • `excited` • `angry` • `loving` • `surprised` • `laughing` • `scared` • `suspicious` • `confused` • `curious` • `proud` • `shy` • `bored` • `sleepy` • `crazy` • `determined` • `guilty` • `amazed` • `doubtful` • `attentive`

### Background Styles (6)

`solid` • `taygeta` • `celaeno` • `alcyone` • `maia` • `merope`

---

## 🧰 Utilities Included

- `createAvatar(seed: string, options?: SquishOptions): string | SquishJson`  
  Generates a complete SVG string (default) or a structured JSON object (`format: "json"`) containing the rendered SVG, ready-to-use Data URI, and full geometric layout metadata.

- `resolveShape` / `resolveExpression` / `resolveBackgroundStyle`  
  Same contract as `resolveVariant` in `@usespaceui/avatars`: omit → default, exact id → that id, `"all"` → deterministic pick from the seed.

- `resolveLayout(seed: string, options?: SquishOptions): SquishLayout`  
  Executes the deterministic geometric solver to compute transformed eye capsules, body bezier paths, and palettes without rendering.

- `renderLayout(layout: SquishLayout, options?: SquishOptions): string`  
  Serializes a computed `SquishLayout` object into a lightweight SVG document.

- `SquishEngine`  
  Stateful animation class that powers fluid morphs, gaze physics calculations, and timeline orchestration.

---

## 📦 Related Packages

| Package                                                            | Description                                                 |
| :----------------------------------------------------------------- | :---------------------------------------------------------- |
| [`@usespaceui/avatars`](https://github.com/usespaceui/avatars)     | Classic generative SVG avatar engine with multiple families |
| [`@usespaceui/gradients`](https://github.com/usespaceui/gradients) | Procedural CSS & SVG gradient generator                     |
| [`@usespaceui/sounds`](https://github.com/usespaceui/sounds)       | UI sound effects and audio interactions                     |
| [`@usespaceui/squircle`](https://github.com/usespaceui/squircle)   | iOS & Figma style continuous curvature squircles            |

---

## 🪪 License

MIT — Free for personal and commercial projects.

---

## 📚 Resources

- 🔍 [Interactive Studio & Playground](https://www.spaceui.one/tools/avatars?type=squishmoji)
- 📖 [Space UI Documentation](https://www.spaceui.one)
- 🌍 [Space UI Community](https://github.com/usespaceui)

---

## 🛠 Maintenance

If you discover a bug or have a feature request, please open an [issue on GitHub](https://github.com/usespaceui/squishmoji/issues).

---

<p align="center">
  <a href="https://www.spaceui.one" target="_blank">
    <img src="https://www.spaceui.one/favicon.ico" width="60" style="border-radius: 50%" alt="Space UI Logo" />
  </a>
  <br />
  <b>Maintained by the Space UI Team</b>
</p>
