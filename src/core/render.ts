import { resolveLayout } from "../engine/layout";
import { capsulePath } from "./geometry";
import { format, stableId, escapeXml } from "./svg";
import { resolveBackgroundStyle, resolveExpression, resolveShape } from "./resolve";
import { backgroundMarkup } from "../engine/backgrounds";
import {
  type SquishOptions,
  type SquishLayout,
  type SquishJson,
  SquishOutputFormat,
  DEFAULT_SEED,
  BACKGROUND_STYLES,
} from "../types";

export function createAvatar(
  seed: string,
  options: SquishOptions & { format: "json" | typeof SquishOutputFormat.json },
): SquishJson;
export function createAvatar(
  seed: string,
  options?: SquishOptions & { format?: "svg" | typeof SquishOutputFormat.svg },
): string;
export function createAvatar(
  options: SquishOptions & { format: "json" | typeof SquishOutputFormat.json },
): SquishJson;
export function createAvatar(
  options?: SquishOptions & { format?: "svg" | typeof SquishOutputFormat.svg },
): string;
export function createAvatar(
  seedOrOptions?: string | SquishOptions,
  maybeOptions?: SquishOptions,
): string | SquishJson {
  let seed = DEFAULT_SEED;
  let options: SquishOptions = {};

  if (typeof seedOrOptions === "string") {
    seed = seedOrOptions.trim() || DEFAULT_SEED;
    options = maybeOptions ?? {};
  } else if (seedOrOptions && typeof seedOrOptions === "object") {
    options = seedOrOptions;
    seed = (options.seed && options.seed.trim()) || DEFAULT_SEED;
  }

  const layout = resolveLayout(seed, options);
  const svg = renderLayout(layout, { ...options, seed });

  if (options.format === "json") {
    return {
      seed,
      shape: resolveShape(seed, options.shape),
      expression: resolveExpression(seed, options.expression),
      size: options.size,
      backgroundStyle: resolveBackgroundStyle(seed, options.backgroundStyle),
      svg,
      dataUri: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      layout,
    };
  }

  return svg;
}

export function renderLayout(
  layout: SquishLayout,
  options: SquishOptions = {},
): string {
  const {
    size: requestedSize,
    seed = DEFAULT_SEED,
    backgroundStyle: backgroundChoice,
  } = options;
  const backgroundStyle = resolveBackgroundStyle(seed, backgroundChoice);
  const size = requestedSize
    ? ` width="${requestedSize}" height="${requestedSize}"`
    : "";
  const bodyColor = escapeXml(layout.colors.body);
  const palette = layout.colors.palette;
  // SVG ids are document-global in the demo grid. Include the layout seed so
  // two avatars with the same shape and palette never share a clip definition.
  const uid = `sq-${stableId(layout.body + backgroundStyle + palette.join("|") + layout.seed)}`;
  const iris = escapeXml(layout.colors.eye);
  const body =
    backgroundStyle === BACKGROUND_STYLES.solid
      ? `<path d="${layout.body}" fill="${bodyColor}"/>`
      : "";
  const background = backgroundMarkup(
    layout.body,
    backgroundStyle,
    palette,
    uid,
    layout.seed,
  );
  const eyes = layout.eyes
    .map(
      (eye, index) =>
        `<path data-sq-eye="${index}" d="${capsulePath(eye.width, eye.height)}" transform="matrix(${eye.matrix.map(format).join(" ")})" fill="${iris}"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-158 -158 316 316"${size} style="overflow:visible"><defs>${background.defs}</defs>${body}${background.layers}${eyes}</svg>`;
}
