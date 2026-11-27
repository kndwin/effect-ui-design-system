import * as TokenColor from "@acme/design-system/TokenColor"
import * as TokenDuration from "@acme/design-system/TokenDuration"
import * as TokenFont from "@acme/design-system/TokenFont"
import * as TokenLength from "@acme/design-system/TokenLength"
import * as TokenShadow from "@acme/design-system/TokenShadow"
import * as TokenWeight from "@acme/design-system/TokenWeight"

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
  "ring",
  "overlay"
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
  "column",
  "check",
  "switchWidth",
  "switchHeight",
  "switchThumb",
  "sliderTrack",
  "sliderThumb",
  "field",
  "popup",
  "dialog",
  "drawer",
  "tooltip"
])
export const Radius = TokenLength.make("radius", ["control", "check", "avatarSquare", "container", "full"])
export const Stroke = TokenLength.make("stroke", ["border", "focus", "focusOffset"])
export const Text = TokenLength.make("text", ["xs", "sm", "md", "lg", "xl", "2xl", "code"])
export const Font = TokenFont.make("font", ["body", "mono"])
export const Weight = TokenWeight.make("weight", ["regular", "medium", "semibold"])
export const Shadow = TokenShadow.make("shadow", ["control", "overlay"])
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
