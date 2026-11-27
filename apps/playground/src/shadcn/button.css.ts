import * as Style from "@cave/ds/Style"
import { alpha } from "@cave/ds/Token"
import * as Variant from "@cave/ds/Variant"
import { Button } from "@cave/ds/kit/button"
import { ButtonSize, ButtonVariant } from "./scales.ts"
import { Colors, Motion, Radius, Shadow, Spacing, Stroke, Text } from "./tokens.ts"

export const ButtonStyle = Style.make(Button)({
  // inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium
  // transition-all outline-none disabled:pointer-events-none disabled:opacity-50
  // focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
  base: {
    root: {
      display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      gap: Spacing[2], whiteSpace: "nowrap", borderRadius: Radius.md,
      fontSize: Text.sm, lineHeight: Text.smLeading, fontWeight: 500, fontFamily: "inherit",
      borderWidth: Stroke.hairline, borderStyle: "solid", borderColor: alpha(Colors.border, 0),
      cursor: "pointer", outline: "none",
      transitionProperty: "color, background-color, border-color, box-shadow, outline-color",
      transitionDuration: Motion.fast,
      states: {
        disabled: { pointerEvents: "none", opacity: 0.5 },
        focusVisible: {
          borderColor: Colors.ring,
          outlineStyle: "solid", outlineWidth: Stroke.ring, outlineColor: alpha(Colors.ring, 50), outlineOffset: 0
        }
      }
    }
  },
  variants: {
    variant: Variant.make(ButtonVariant, {
      // bg-primary text-primary-foreground shadow-xs hover:bg-primary/90
      default: {
        root: { background: Colors.primary, color: Colors.primaryForeground, boxShadow: Shadow.xs,
                states: { hover: { background: alpha(Colors.primary, 90) } } }
      },
      // bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20
      destructive: {
        root: { background: Colors.destructiveSurface, color: Colors.destructiveForeground, boxShadow: Shadow.xs,
                states: { hover: { background: alpha(Colors.destructive, 90) },
                          focusVisible: { outlineColor: alpha(Colors.destructive, 20) } } }
      },
      // border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground
      outline: {
        root: { background: Colors.outlineSurface, color: Colors.foreground, borderColor: Colors.outlineBorder,
                boxShadow: Shadow.xs,
                states: { hover: { background: Colors.accent, color: Colors.accentForeground } } }
      },
      // bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80
      secondary: {
        root: { background: Colors.secondary, color: Colors.secondaryForeground, boxShadow: Shadow.xs,
                states: { hover: { background: alpha(Colors.secondary, 80) } } }
      },
      // hover:bg-accent hover:text-accent-foreground
      ghost: {
        root: { background: alpha(Colors.accent, 0), color: Colors.foreground,
                states: { hover: { background: Colors.accent, color: Colors.accentForeground } } }
      },
      // text-primary underline-offset-4 hover:underline
      link: {
        root: { background: alpha(Colors.primary, 0), color: Colors.primary, textUnderlineOffset: Spacing[1],
                states: { hover: { textDecorationLine: "underline" } } }
      }
    }, { default: "default" }),
    size: Variant.make(ButtonSize, {
      default: { root: { height: Spacing[9], paddingInline: Spacing[4], paddingBlock: Spacing[2] } }, // h-9 px-4 py-2
      sm: { root: { height: Spacing[8], paddingInline: Spacing[3], gap: Spacing["1.5"] } },            // h-8 px-3 gap-1.5
      lg: { root: { height: Spacing[10], paddingInline: Spacing[6] } },                                // h-10 px-6
      icon: { root: { width: Spacing[9], height: Spacing[9], paddingInline: 0 } }                      // size-9
    }, { default: "default" })
  }
})
