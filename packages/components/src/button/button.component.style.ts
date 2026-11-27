import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as Variant from "@acme/design-system/Variant"
import { ButtonParts } from "./button.parts.pure.ts"
import { ControlSize, Tone } from "../scales.pure.ts"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size as Sizes,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../contract.token.ts"

export const ButtonStyle = Style.make(ButtonParts)({
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
            states: {
              hover: { background: Colors.surfaceMuted },
              pressed: { borderColor: Colors.accent, background: TokenColor.alpha(Colors.accent, 8) }
            }
          }
        },
        danger: {
          root: {
            background: Colors.danger,
            color: Colors.dangerFg,
            borderColor: Colors.danger,
            states: { hover: { background: TokenColor.alpha(Colors.danger, 88) } }
          }
        },

        ghost: {
          root: {
            background: TokenColor.alpha(Colors.fg, 0),
            color: Colors.fgMuted,
            borderColor: TokenColor.alpha(Colors.fg, 0),
            boxShadow: "none",
            states: {
              hover: { background: Colors.surfaceMuted, color: Colors.fg },
              pressed: { background: Colors.surfaceMuted, color: Colors.fg }
            }
          }
        }
      },
      { default: "neutral" }
    ),

    fill: Variant.flag({ root: { width: "100%", justifyContent: "flex-start" } }),
    size: Variant.make(
      ControlSize,
      {
        sm: { root: { height: Sizes.controlSm, paddingInline: Spacing[3] } },
        md: { root: { height: Sizes.controlMd, paddingInline: Spacing[4] } }
      },
      { default: "md" }
    )
  }
})
