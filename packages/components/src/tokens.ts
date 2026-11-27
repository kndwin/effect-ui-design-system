// 🔒 The token CONTRACT: names and kinds only. Themes (@acme/theme-*) supply the values,
// and Theme.make won't compile unless a theme fills in every key here.
import { TokenColor, TokenDuration, TokenFont, TokenLength, TokenShadow, TokenWeight } from "@acme/ds"

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
/** Avatar fallback backgrounds; text on them uses Colors.onHue */
export const Hues = TokenColor.make("hue", ["blue", "green", "amber", "rose", "onHue"])
export const Spacing = TokenLength.make("spacing", [1, 2, 3, 4, 6])
export const Size = TokenLength.make("size", ["controlSm", "controlMd", "avatarSm", "avatarMd", "avatarLg"])
export const Radius = TokenLength.make("radius", ["control", "avatarSquare", "full"])
export const Stroke = TokenLength.make("stroke", ["border", "focus", "focusOffset"])
export const Text = TokenLength.make("text", ["xs", "sm", "md"])
export const Font = TokenFont.make("font", ["body"])
export const Weight = TokenWeight.make("weight", ["medium", "semibold"])
export const Shadow = TokenShadow.make("shadow", ["control"])
export const Motion = TokenDuration.make("motion", ["fast"])

/** The whole contract, as one object: what a theme must fill in. */
export const Tokens = { Colors, Hues, Spacing, Size, Radius, Stroke, Text, Font, Weight, Shadow, Motion }
