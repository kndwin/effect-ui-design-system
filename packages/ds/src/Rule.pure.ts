import type { Properties } from "csstype"
import type { Ref } from "./Token.pure.ts"

type CSSProperties = Properties<number | (string & {})>

// Properties whose values must come from tokens. Everything else (display,
// cursor, opacity…) is a keyword/number and is left to lint.
type ColorProp = "color" | "background" | "backgroundColor" | "borderColor" | "outlineColor" | "fill" | "stroke"
type LengthProp =
  | "padding"
  | "paddingInline"
  | "paddingBlock"
  | "paddingTop"
  | "paddingRight"
  | "paddingBottom"
  | "paddingLeft"
  | "margin"
  | "marginInline"
  | "marginBlock"
  | "gap"
  | "rowGap"
  | "columnGap"
  | "borderRadius"
  | "borderWidth"
  | "outlineWidth"
  | "outlineOffset"
  | "width"
  | "height"
  | "minWidth"
  | "minHeight"
  | "maxWidth"
  | "maxHeight"
  | "fontSize"
  | "textUnderlineOffset"
  | "top"
  | "right"
  | "bottom"
  | "left"
  | "inset"
type DurationProp = "transitionDuration" | "animationDuration"
type ShadowProp = "boxShadow"
/** unitless multiplier or a Length token */
type LineHeightProp = "lineHeight"
type FontProp = "fontFamily"
type WeightProp = "fontWeight"

/** Layout keywords aren't design decisions, so they're allowed without a token. */
type LengthKeyword = 0 | "auto" | "none" | "100%" | "100vh" | "fit-content" | "min-content" | "max-content"

/** Kit CSS vars (e.g. Select.vars.availableHeight) are Length refs too. */
export type Decl = Omit<
  CSSProperties,
  ColorProp | LengthProp | DurationProp | ShadowProp | FontProp | WeightProp | LineHeightProp
> & { readonly [P in LineHeightProp]?: Ref<"Length"> | number } & { readonly [P in FontProp]?: Ref<"Font"> } & {
  readonly [P in WeightProp]?: Ref<"Weight">
} & { readonly [P in DurationProp]?: Ref<"Duration"> } & { readonly [P in ShadowProp]?: Ref<"Shadow"> | "none" } & {
  readonly [P in ColorProp]?: Ref<"Color">
} & { readonly [P in LengthProp]?: Ref<"Length"> | LengthKeyword }

/** Named breakpoints. Media queries can't read CSS variables, so these are fixed here. */
export const breakpoints = { narrow: "screen and (max-width: 860px)" } as const
export type Breakpoint = keyof typeof breakpoints

export type SlotRule<State extends string> = Decl & {
  /** overrides below a breakpoint: `media: { narrow: { … } }` */
  readonly media?: { readonly [B in Breakpoint]?: Decl }
  /** A part with no states (e.g. Avatar's image) takes no `states` key at all. */
  readonly states?: [State] extends [never] ? never : { readonly [S in State]?: Decl }
}
