import type { CSSProperties } from "@vanilla-extract/css"
import type { Ref } from "./Token.ts"

// Properties whose values must come from tokens. Everything else (display,
// cursor, opacity…) is a keyword/number and is left to lint.
type ColorProp =
  | "color" | "background" | "backgroundColor" | "borderColor" | "outlineColor" | "fill" | "stroke"
type LengthProp =
  | "padding" | "paddingInline" | "paddingBlock" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft"
  | "margin" | "marginInline" | "marginBlock" | "gap" | "rowGap" | "columnGap"
  | "borderRadius" | "borderWidth" | "outlineWidth" | "outlineOffset"
  | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "fontSize"
  | "textUnderlineOffset"
type DurationProp = "transitionDuration" | "animationDuration"
type ShadowProp = "boxShadow"
/** unitless multiplier or a Length token */
type LineHeightProp = "lineHeight"
type FontProp = "fontFamily"
type WeightProp = "fontWeight"

/** Layout keywords aren't design decisions, so they're allowed without a token. */
type LengthKeyword = 0 | "auto" | "100%" | "fit-content" | "min-content" | "max-content"

/** Kit CSS vars (e.g. Select.vars.availableHeight) are Length refs too. */
export type Decl =
  & Omit<CSSProperties, ColorProp | LengthProp | DurationProp | ShadowProp | FontProp | WeightProp | LineHeightProp>
  & { readonly [P in LineHeightProp]?: Ref<"Length"> | number }
  & { readonly [P in FontProp]?: Ref<"Font"> }
  & { readonly [P in WeightProp]?: Ref<"Weight"> }
  & { readonly [P in DurationProp]?: Ref<"Duration"> }
  & { readonly [P in ShadowProp]?: Ref<"Shadow"> }
  & { readonly [P in ColorProp]?: Ref<"Color"> }
  & { readonly [P in LengthProp]?: Ref<"Length"> | LengthKeyword }

export type SlotRule<State extends string> = Decl & {
  /** A part with no states (e.g. Avatar's image) takes no `states` key at all. */
  readonly states?: [State] extends [never] ? never : { readonly [S in State]?: Decl }
}
