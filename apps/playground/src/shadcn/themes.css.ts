// 🔒
import * as Theme from "@cave/ds/Theme"
import { Colors, Motion, Radius, Shadow, Spacing, Stroke, Text } from "./tokens.ts"

export const light = Theme.make({ Colors, Spacing, Radius, Stroke, Text, Shadow, Motion }, {
  Colors: {
    background: "oklch(1 0 0)", foreground: "oklch(0.145 0 0)",
    primary: "oklch(0.205 0 0)", primaryForeground: "oklch(0.985 0 0)",
    secondary: "oklch(0.97 0 0)", secondaryForeground: "oklch(0.205 0 0)",
    accent: "oklch(0.97 0 0)", accentForeground: "oklch(0.205 0 0)",
    destructive: "oklch(0.577 0.245 27.325)", destructiveForeground: "oklch(1 0 0)",
    border: "oklch(0.922 0 0)", input: "oklch(0.922 0 0)", ring: "oklch(0.708 0 0)",
    destructiveSurface: "oklch(0.577 0.245 27.325)", outlineSurface: "oklch(1 0 0)", outlineBorder: "oklch(0.922 0 0)"
  },
  Spacing: { 1: 4, "1.5": 6, 2: 8, 2.5: 10, 3: 12, 4: 16, 6: 24, 8: 32, 9: 36, 10: 40 },
  Radius: { md: 8 },
  Stroke: { hairline: 1, ring: 3 },
  Text: { sm: "0.875rem", smLeading: "1.25rem" },
  Shadow: { xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
  Motion: { fast: "150 millis" }
}, { name: "light", default: true })

export const dark = Theme.make({ Colors }, {
  Colors: {
    background: "oklch(0.145 0 0)", foreground: "oklch(0.985 0 0)",
    primary: "oklch(0.922 0 0)", primaryForeground: "oklch(0.205 0 0)",
    secondary: "oklch(0.269 0 0)", secondaryForeground: "oklch(0.985 0 0)",
    accent: "oklch(0.269 0 0)", accentForeground: "oklch(0.985 0 0)",
    destructive: "oklch(0.704 0.191 22.216)", destructiveForeground: "oklch(1 0 0)",
    border: "oklch(1 0 0 / 10%)", input: "oklch(1 0 0 / 15%)", ring: "oklch(0.556 0 0)",
    // dark:bg-destructive/60, dark:bg-input/30, dark:border-input
    destructiveSurface: "oklch(0.704 0.191 22.216 / 60%)", outlineSurface: "oklch(1 0 0 / 4.5%)", outlineBorder: "oklch(1 0 0 / 15%)"
  }
}, { name: "dark" })
