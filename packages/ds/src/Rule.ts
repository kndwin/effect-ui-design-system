import type { CSSProperties } from "@vanilla-extract/css"
import type { Ref } from "./Token.ts"

// Properties whose values must come from tokens. Everything else (display,
// cursor, opacity, font-weight…) is a keyword/number and is left to lint.
type ColorProp =
  | "color" | "background" | "backgroundColor" | "borderColor" | "outlineColor" | "fill" | "stroke"
type LengthProp =
  | "padding" | "paddingInline" | "paddingBlock" | "paddingTop" | "paddingRight" | "paddingBottom" | "paddingLeft"
  | "margin" | "marginInline" | "marginBlock" | "gap" | "rowGap" | "columnGap"
  | "borderRadius" | "borderWidth" | "outlineWidth" | "outlineOffset"
  | "width" | "height" | "minWidth" | "minHeight" | "maxWidth" | "maxHeight" | "fontSize" | "lineHeight"
  | "textUnderlineOffset"
type DurationProp = "transitionDuration" | "animationDuration"
type ShadowProp = "boxShadow"

/** Kit CSS vars (e.g. Select.vars.availableHeight) are Length refs too. */
export type Decl =
  & Omit<CSSProperties, ColorProp | LengthProp | DurationProp | ShadowProp>
  & { readonly [P in DurationProp]?: Ref<"Duration"> }
  & { readonly [P in ShadowProp]?: Ref<"Shadow"> }
  & { readonly [P in ColorProp]?: Ref<"Color"> }
  & { readonly [P in LengthProp]?: Ref<"Length"> | 0 }

export type SlotRule<State extends string> = Decl & {
  readonly states?: { readonly [S in State]?: Decl }
}
