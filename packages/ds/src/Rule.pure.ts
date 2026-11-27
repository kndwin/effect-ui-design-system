import type { Properties } from "csstype"
import type { Ref } from "./Token.pure.ts"

type CSSProperties = Properties<number | (string & {})>

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

type LineHeightProp = "lineHeight"
type FontProp = "fontFamily"
type WeightProp = "fontWeight"

type LengthKeyword = 0 | "auto" | "none" | "100%" | "100vh" | "fit-content" | "min-content" | "max-content"

export type Decl = Omit<
  CSSProperties,
  ColorProp | LengthProp | DurationProp | ShadowProp | FontProp | WeightProp | LineHeightProp
> & { readonly [P in LineHeightProp]?: Ref<"Length"> | number } & { readonly [P in FontProp]?: Ref<"Font"> } & {
  readonly [P in WeightProp]?: Ref<"Weight">
} & { readonly [P in DurationProp]?: Ref<"Duration"> } & { readonly [P in ShadowProp]?: Ref<"Shadow"> | "none" } & {
  readonly [P in ColorProp]?: Ref<"Color">
} & { readonly [P in LengthProp]?: Ref<"Length"> | LengthKeyword }

export const breakpoints = { narrow: "screen and (max-width: 860px)" } as const
export type Breakpoint = keyof typeof breakpoints

export type SlotRule<State extends string> = Decl & {
  readonly media?: { readonly [B in Breakpoint]?: Decl }

  readonly states?: [State] extends [never] ? never : { readonly [S in State]?: Decl }
}
