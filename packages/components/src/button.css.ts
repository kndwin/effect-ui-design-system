import { Style, TokenColor, Variant } from "@acme/ds"
import { Button } from "@acme/ds/kit/button"
import { Size, Tone } from "./scales.ts"
import { Colors, Font, Motion, Radius, Shadow, Size as Sizes, Spacing, Stroke, Text, Weight } from "./tokens.ts"

export const ButtonStyle = Style.make(Button)({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing[2],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      whiteSpace: "nowrap",
      borderRadius: Radius.control,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      boxShadow: Shadow.control,
      cursor: "pointer",
      transitionProperty: "background-color, color, border-color",
      transitionDuration: Motion.fast,
      states: {
        disabled: { opacity: 0.5, cursor: "not-allowed" },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        }
      }
    }
  },
  variants: {
    tone: Variant.make(
      Tone,
      {
        primary: {
          root: {
            background: Colors.accent,
            color: Colors.accentFg,
            borderColor: Colors.accent,
            states: { hover: { background: TokenColor.alpha(Colors.accent, 88) } }
          }
        },
        neutral: {
          root: {
            background: Colors.surface,
            color: Colors.fg,
            borderColor: Colors.border,
            states: { hover: { background: Colors.surfaceMuted } }
          }
        },
        danger: {
          root: {
            background: Colors.danger,
            color: Colors.dangerFg,
            borderColor: Colors.danger,
            states: { hover: { background: TokenColor.alpha(Colors.danger, 88) } }
          }
        }
      },
      { default: "neutral" }
    ),
    size: Variant.make(
      Size,
      {
        sm: { root: { height: Sizes.controlSm, paddingInline: Spacing[3] } },
        md: { root: { height: Sizes.controlMd, paddingInline: Spacing[4] } }
      },
      { default: "md" }
    )
  }
})
