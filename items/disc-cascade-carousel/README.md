# Disc Cascade Carousel

Items as printed discs on a slanted line climbing toward the viewer. The chosen disc sits in the middle,
earlier ones shrink away to the left, the next looms large top right. Credits block and press quotes
change with the selection. Spring-driven, drag / flick / trackpad / keys / Index menu.

**Files:** `disc-cascade-carousel.tsx` (component), `demo.tsx` (usage, dark vinyl-catalogue example)

## Install into a shadcn project

- Copy to `components/ui/disc-cascade-carousel.tsx`, import as `@/components/ui/disc-cascade-carousel`.
  (`/components/ui` is the shadcn default for primitives, and the `@/` alias in `demo.tsx` assumes it.)
- Needs: React 18+ (uses `useId`), TypeScript. **No other dependencies.** No Tailwind needed either:
  it injects its own scoped `.dcc-*` CSS and reads the theme's `--color-foreground`,
  `--color-background`, `--color-primary` if present, with fallbacks.
- No lucide-react: the two icons are inline SVG.
- Fonts load only if you pass `fontHref`; otherwise it falls back to system serif/sans/Impact.
- Client component (`"use client"`).

## Key props

| Prop | Default | Note |
|---|---|---|
| `items` | required | `{ title, src?, credits?, reviews?, pattern?, palette?, label?, labelStyle?, ink?, fine? }` |
| `height` | `100svh` | must be a definite length |
| `discSize` | `clamp(170px, min(50vmin, 38vw), 420px)` | chosen disc diameter |
| `loop` / `autoplay` | `false` / `0` | autoplay in ms, pauses off-screen and on interaction |
| `brand`, `nav`, `indexLabel` | | top bar; `""` hides |
| `spacing` `rise` `depth` `yaw` `fan` `tilt` `roll` | | pose geometry |
| `bounce`, `duration` | `0.22`, `0.9` | spring feel |
| `spin`, `sheen` | `24`, `0.6` | idle revolution (s), glint strength |
| `background`, `color`, `serif`, `sans`, `display`, `fontHref` | | theming |
| `index` / `defaultIndex` / `onIndexChange` / `onSelect` | `—` / `2` | controlled or uncontrolled |

## Notes

- Without `src`, each disc label is generated SVG: `sunburst | rings | halftone | horizon | stripes | eclipse | mosaic`.
- Demo images are Unsplash URLs (600×600). Swap for your own.
- Mobile: layout uses container queries, nav links, hint and second quote hide under 720px.
- Respects `prefers-reduced-motion`.
- Not used in the portfolio yet. The portfolio itself is plain HTML, so using this there needs a React island.
