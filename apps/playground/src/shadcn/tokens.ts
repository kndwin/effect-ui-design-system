// 🔒 shadcn/ui "neutral" tokens, as Token groups.
import { Schema } from "effect"
import * as Token from "@cave/ds/Token"

export const Colors = Token.group("color", Schema.Struct({
  background: Token.Color, foreground: Token.Color,
  primary: Token.Color, primaryForeground: Token.Color,
  secondary: Token.Color, secondaryForeground: Token.Color,
  accent: Token.Color, accentForeground: Token.Color,
  destructive: Token.Color, destructiveForeground: Token.Color, // shadcn hard-codes text-white here
  border: Token.Color, input: Token.Color, ring: Token.Color,
  // shadcn's `dark:` one-offs, turned into semantic tokens so components never branch on theme
  destructiveSurface: Token.Color, outlineSurface: Token.Color, outlineBorder: Token.Color
}))
// Tailwind's 0.25rem steps, only the ones the button uses
export const Spacing = Token.group("spacing", Schema.Struct({
  1: Token.Length, "1.5": Token.Length, 2: Token.Length, 2.5: Token.Length, 3: Token.Length,
  4: Token.Length, 6: Token.Length, 8: Token.Length, 9: Token.Length, 10: Token.Length
}))
export const Radius = Token.group("radius", Schema.Struct({ md: Token.Length }))
export const Stroke = Token.group("stroke", Schema.Struct({ hairline: Token.Length, ring: Token.Length }))
export const Text = Token.group("text", Schema.Struct({ sm: Token.Length, smLeading: Token.Length }))
export const Shadow = Token.group("shadow", Schema.Struct({ xs: Token.Shadow }))
export const Motion = Token.group("motion", Schema.Struct({ fast: Token.Duration }))
