import assert from 'node:assert/strict'
import * as squish from '../dist/index.js'
import * as squishReact from '../dist/react.js'
import {
  createAvatar,
  resolveLayout,
  renderLayout,
  SquishOutputFormat,
  SHAPE_LIST,
  EXPRESSION_LIST,
} from '../dist/index.js'

// 1. Determinism
const defaultSvg = createAvatar()
assert.equal(defaultSvg, createAvatar(), 'the default seed must be deterministic')
assert.equal(typeof defaultSvg, 'string', 'createAvatar returns an SVG string by default')
assert.match(defaultSvg, /<svg /, 'output starts with an SVG element')
assert.ok(!defaultSvg.includes('<title>'), 'no title tag pollution in SVG')

// 2. Stable generation by seed
const seedA = createAvatar('space-cadet')
const seedB = createAvatar('space-cadet')
assert.equal(seedA, seedB, 'same seed produces identical SVG')

// 3. JSON Output format
const jsonOutput = createAvatar('space-cadet', {
  shape: 'cat',
  expression: 'loving',
  format: SquishOutputFormat.json,
})
assert.equal(jsonOutput.seed, 'space-cadet', 'JSON output retains seed')
assert.equal(jsonOutput.shape, 'cat', 'JSON output retains shape')
assert.equal(jsonOutput.expression, 'loving', 'JSON output retains expression')
assert.match(jsonOutput.dataUri, /^data:image\/svg\+xml;utf8,/, 'dataUri is properly formatted')
assert.ok(jsonOutput.layout, 'layout metadata is present')

// 4. Two-phase pipeline
const layout = resolveLayout('space-cadet')
const renderedSvg = renderLayout(layout, { seed: 'space-cadet' })
assert.equal(typeof renderedSvg, 'string', 'two-phase layout renders to string')

// 5. Catalogs
assert.ok(SHAPE_LIST.length >= 21, 'at least 21 shapes supported')
assert.ok(EXPRESSION_LIST.length >= 20, 'at least 20 expressions supported')

// 6. React Exports
assert.ok(squishReact.Avatar, 'Avatar is exported in /react')
assert.ok(squishReact.Squishmoji, 'Squishmoji alias is exported in /react')
assert.equal(squishReact.Avatar, squishReact.Squishmoji, 'Squishmoji is an exact alias of Avatar')

console.log('Squishmoji package contracts passed successfully.')
