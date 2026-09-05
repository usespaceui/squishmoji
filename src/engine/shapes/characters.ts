import type { SquishTraits } from '../../types'

const wave = (angle: number, frequency: number, cosine = 0, sine = 0) =>
  cosine * Math.cos(angle * frequency) + sine * Math.sin(angle * frequency)

function polarPoint(angle: number, radius: number, traits: SquishTraits) {
  return { x: traits.width * Math.cos(angle) * radius, y: traits.height * Math.sin(angle) * radius }
}

const catRadius = (a: number) => 0.8437818 +
  wave(a, 1, 0, -0.040621) + wave(a, 3, 0, -0.038071) + wave(a, 4, -0.0508797) +
  wave(a, 5, 0, 0.0334423) + wave(a, 7, 0, 0.0275348) + wave(a, 8, 0.0345042) +
  wave(a, 9, 0, -0.0212507) + wave(a, 11, 0, -0.0153733) + wave(a, 12, -0.0180561) +
  wave(a, 13, 0, 0.0104229) + wave(a, 15, 0, 0.0066203) + wave(a, 16, 0.0072705) +
  wave(a, 17, 0, -0.0039374) + wave(a, 19, 0, -0.0021929) + wave(a, 20, -0.0022808) +
  wave(a, 21, 0, 0.0011456) + wave(a, 23, 0, 0.0005638) + wave(a, 24, 0.000539)

const ghostRadius = (a: number) => 0.8879889 + wave(a, 2, -0.0683074) + wave(a, 4, 0.0338336) +
  wave(a, 5, 0, 0.0403926) + wave(a, 6, -0.0239956) + wave(a, 8, -0.0067739) +
  wave(a, 10, -0.0036398) + wave(a, 12, -0.0023855) + wave(a, 14, -0.0017377) +
  wave(a, 16, -0.0013539) + wave(a, 18, -0.0011021) + wave(a, 20, -0.0009347) +
  wave(a, 22, -0.0008251) + wave(a, 24, -0.0007438) + wave(a, 26, -0.0006951) +
  wave(a, 28, -0.0006646)

const ufoRadius = (a: number) => 0.8598646 + wave(a, 1, 0, 0.1686754) + wave(a, 2, -0.0308688) +
  wave(a, 3, 0, 0.0169516) + wave(a, 4, 0.0130741) + wave(a, 5, 0, -0.0090619) +
  wave(a, 6, -0.0052607) + wave(a, 7, 0, 0.021205) + wave(a, 8, -0.0001659) +
  wave(a, 9, 0, 0.0014904) + wave(a, 10, 0.0019518) + wave(a, 11, 0, -0.0017363) +
  wave(a, 12, -0.0011182) + wave(a, 13, 0, 0.0003532) + wave(a, 14, -0.0003231) +
  wave(a, 15, 0, 0.0007263) + wave(a, 16, 0.0008503) + wave(a, 17, 0, -0.0006757) +
  wave(a, 18, -0.0003513) + wave(a, 19, 0, -0.0000351) + wave(a, 20, -0.0003394) +
  wave(a, 21, 0, 0.0004763) + wave(a, 22, 0.0004631) + wave(a, 23, 0, -0.000296) +
  wave(a, 24, -0.0000553)

const botRadius = (a: number) => 0.894271 + wave(a, 1, 0, 0.0773445) + wave(a, 2, 0.0113329) +
  wave(a, 3, 0, 0.077849) + wave(a, 4, 0.0059836) + wave(a, 5, 0, -0.0163545) +
  wave(a, 6, -0.0661846) + wave(a, 7, 0, 0.0254971) + wave(a, 8, 0.0104856) +
  wave(a, 9, 0, -0.0075892) + wave(a, 10, -0.0078926) + wave(a, 11, 0, 0.0083205) +
  wave(a, 12, -0.0014887) + wave(a, 13, 0, -0.0006156) + wave(a, 14, -0.0021853) +
  wave(a, 15, 0, 0.0012076) + wave(a, 16, 0.0007318)

/**
 * Returns the procedural edge point for the 'alien' shape.
 */
export function alienPoint(traits: SquishTraits, angle: number) {
  const radius = 0.843547 + 0.126532 * Math.sin(angle * 3) + 0.030562 * Math.cos(angle * 7) - 0.078627 * Math.sin(angle * 7)
  return polarPoint(angle, radius, traits)
}

const lionRadius = (a: number) => 0.8559143 + wave(a, 1, 0, 0.025802) + wave(a, 2, 0.1260005) +
  wave(a, 3, 0, -0.092849) + wave(a, 4, 0.0063454) + wave(a, 5, 0, -0.0392755) +
  wave(a, 6, -0.0482486) + wave(a, 7, 0, 0.0213423) + wave(a, 8, -0.0267201) +
  wave(a, 9, 0, 0.0205997) + wave(a, 10, -0.0042196) + wave(a, 11, 0, -0.0070324) +
  wave(a, 12, -0.0103312) + wave(a, 13, 0, -0.0089657) + wave(a, 14, -0.0134167) +
  wave(a, 15, 0, 0.0050351) + wave(a, 16, -0.0016524) + wave(a, 17, 0, 0.0052174) +
  wave(a, 18, 0.0021842) + wave(a, 19, 0, -0.0018497) + wave(a, 20, -0.006038) +
  wave(a, 21, 0, 0.0002366) + wave(a, 22, -0.0071642) + wave(a, 23, 0, 0.0035524) +
  wave(a, 24, 0.0000034) + wave(a, 25, 0, -0.0006834) + wave(a, 26, 0.0006688) +
  wave(a, 27, 0, -0.0025335) + wave(a, 28, -0.0038505) + wave(a, 29, 0, 0.00239) +
  wave(a, 30, -0.0025543) + wave(a, 31, 0, 0.0027558)

const monkeyRadius = (a: number) => 0.8839422 + wave(a, 1, 0, 0.0075504) + wave(a, 2, 0.0567831) +
  wave(a, 3, 0, 0.0199997) + wave(a, 4, 0.0437135) + wave(a, 5, 0, 0.0256709) +
  wave(a, 6, 0.0270512) + wave(a, 7, 0, 0.0233791) + wave(a, 8, 0.0121207) +
  wave(a, 9, 0, 0.0151972) + wave(a, 10, 0.0025854) + wave(a, 11, 0, 0.005227) +
  wave(a, 12, -0.0006666) + wave(a, 13, 0, -0.0024715) + wave(a, 14, 0.00041) +
  wave(a, 15, 0, -0.0056949) + wave(a, 16, 0.0027287) + wave(a, 17, 0, -0.0047685) +
  wave(a, 18, 0.0036601) + wave(a, 19, 0, -0.0018595) + wave(a, 20, 0.0023347) +
  wave(a, 21, 0, 0.0005398) + wave(a, 22, -0.0002175) + wave(a, 23, 0, 0.0010327) +
  wave(a, 24, -0.0023101) + wave(a, 25, 0, -0.0001325) + wave(a, 26, -0.0026653) +
  wave(a, 27, 0, -0.0015822) + wave(a, 28, -0.0013333) + wave(a, 29, 0, -0.0019541) +
  wave(a, 30, 0.0004429) + wave(a, 31, 0, -0.0008702)

const mechaRadius = (a: number) => 0.8270027 + wave(a, 1, 0, 0.1503181) + wave(a, 2, 0.0309314) +
  wave(a, 3, 0, -0.0570965) + wave(a, 4, -0.1147072) + wave(a, 5, 0, -0.0222479) +
  wave(a, 6, -0.0448762) + wave(a, 7, 0, 0.0038864) + wave(a, 8, 0.0234528) +
  wave(a, 9, 0, 0.0055351) + wave(a, 10, 0.000782) + wave(a, 11, 0, 0.0065911) +
  wave(a, 12, -0.004355) + wave(a, 13, 0, 0.0061225) + wave(a, 14, 0.0037169) +
  wave(a, 15, 0, 0.0014958) + wave(a, 16, -0.0007349)

/** Returns the procedural edge point for the 'cat' shape. */
export function catPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, catRadius(angle), traits) }
/** Returns the procedural edge point for the 'ghost' shape. */
export function ghostPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, ghostRadius(angle), traits) }
/** Returns the procedural edge point for the 'ufo' shape. */
export function ufoPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, ufoRadius(angle), traits) }
/** Returns the procedural edge point for the 'bot' shape. */
export function botPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, botRadius(angle), traits) }
/** Returns the procedural edge point for the 'lion' shape. */
export function lionPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, lionRadius(angle), traits) }
/** Returns the procedural edge point for the 'monkey' shape. */
export function monkeyPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, monkeyRadius(angle), traits) }
/** Returns the procedural edge point for the 'mecha' shape. */
export function mechaPoint(traits: SquishTraits, angle: number) { return polarPoint(angle, mechaRadius(angle), traits) }
