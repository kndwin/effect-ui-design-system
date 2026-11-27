// 🔒 shadcn/ui "neutral" token contract.
import { TokenColor, TokenDuration, TokenFont, TokenLength, TokenShadow, TokenWeight } from "@acme/ds"

export const Colors = TokenColor.make("color", [
  "background", "foreground", "primary", "primaryForeground", "secondary", "secondaryForeground",
  "accent", "accentForeground", "destructive",
  "destructiveForeground", // shadcn hard-codes text-white here
  "border", "input", "ring",
  // shadcn's `dark:` one-offs, turned into semantic tokens so components never branch on theme
  "destructiveSurface", "outlineSurface", "outlineBorder"
])
// Tailwind's 0.25rem steps, only the ones the button uses
export const Spacing = TokenLength.make("spacing", [1, "1.5", 2, 3, 4, 6, 8, 9, 10])
export const Radius = TokenLength.make("radius", ["md"])
export const Stroke = TokenLength.make("stroke", ["hairline", "ring"])
export const Text = TokenLength.make("text", ["sm", "smLeading"])
export const Font = TokenFont.make("font", ["sans"])
export const Weight = TokenWeight.make("weight", ["medium"])
export const Shadow = TokenShadow.make("shadow", ["xs"])
export const Motion = TokenDuration.make("motion", ["fast"])

export const Tokens = { Colors, Spacing, Radius, Stroke, Text, Font, Weight, Shadow, Motion }
