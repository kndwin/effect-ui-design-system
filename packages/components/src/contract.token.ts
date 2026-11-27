import * as TokenColor from "@acme/ds/TokenColor"
import * as TokenDuration from "@acme/ds/TokenDuration"
import * as TokenFont from "@acme/ds/TokenFont"
import * as TokenLength from "@acme/ds/TokenLength"
import * as TokenShadow from "@acme/ds/TokenShadow"
import * as TokenWeight from "@acme/ds/TokenWeight"

export const Colors = TokenColor.make("color", [
  "surface",
  "surfaceMuted",
  "fg",
  "fgMuted",
  "border",
  "accent",
  "accentFg",
  "danger",
  "dangerFg",
  "ring"
])

export const Code = TokenColor.make("code", [
  "surface",
  "fg",
  "muted",
  "border",
  "lineHighlighted",
  "lineAdded",
  "lineRemoved"
])

export const Syntax = TokenColor.make("syntax", ["comment", "string", "keyword", "number", "type", "call"])

export const Hues = TokenColor.make("hue", ["blue", "green", "amber", "rose", "onHue"])
export const Spacing = TokenLength.make("spacing", [1, 2, 3, 4, 6, 8, 12])
export const Size = TokenLength.make("size", [
  "controlSm",
  "controlMd",
  "avatarSm",
  "avatarMd",
  "avatarLg",
  "header",
  "sidebar",
  "panel",
  "content",
  "column"
])
export const Radius = TokenLength.make("radius", ["control", "avatarSquare", "container", "full"])
export const Stroke = TokenLength.make("stroke", ["border", "focus", "focusOffset"])
export const Text = TokenLength.make("text", ["xs", "sm", "md", "lg", "xl", "2xl", "code"])
export const Font = TokenFont.make("font", ["body", "mono"])
export const Weight = TokenWeight.make("weight", ["regular", "medium", "semibold"])
export const Shadow = TokenShadow.make("shadow", ["control"])
export const Motion = TokenDuration.make("motion", ["fast"])

export const Tokens = {
  Colors,
  Code,
  Syntax,
  Hues,
  Spacing,
  Size,
  Radius,
  Stroke,
  Text,
  Font,
  Weight,
  Shadow,
  Motion
}
