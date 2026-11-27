import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as Variant from "@acme/design-system/Variant"
import { ButtonParts } from "./button.parts.constant.ts"
import { ControlSizeSchema, ToneSchema } from "../../platform/scale/scales.schema.ts"
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
} from "../../platform/token/contract.token.ts"

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
      textDecoration: "none",
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
      ToneSchema,
      {
        primary: {
          root: {
            background: Colors.accent,
            color: Colors.accentFg,
            borderColor: Colors.accent,
            states: { hover: { background: TokenColor.makeAlpha(Colors.accent, 88) } }
          }
        },
        neutral: {
          root: {
            background: Colors.surface,
            color: Colors.fg,
            borderColor: Colors.border,
            states: {
              hover: { background: Colors.surfaceMuted },
              pressed: { borderColor: Colors.accent, background: TokenColor.makeAlpha(Colors.accent, 8) },
              current: { borderColor: Colors.accent, background: TokenColor.makeAlpha(Colors.accent, 8) }
            }
          }
        },
        danger: {
          root: {
            background: Colors.danger,
            color: Colors.dangerFg,
            borderColor: Colors.danger,
            states: { hover: { background: TokenColor.makeAlpha(Colors.danger, 88) } }
          }
        },

        ghost: {
          root: {
            background: TokenColor.makeAlpha(Colors.fg, 0),
            color: Colors.fgMuted,
            borderColor: TokenColor.makeAlpha(Colors.fg, 0),
            boxShadow: "none",
            states: {
              hover: { background: Colors.surfaceMuted, color: Colors.fg },
              pressed: { background: Colors.surfaceMuted, color: Colors.fg },
              current: { background: Colors.surfaceMuted, color: Colors.fg }
            }
          }
        }
      },
      { default: "neutral" }
    ),

    fill: Variant.makeFlag({ root: { width: "100%", justifyContent: "flex-start" } }),
    size: Variant.make(
      ControlSizeSchema,
      {
        sm: { root: { height: Sizes.controlSm, paddingInline: Spacing[3] } },
        md: { root: { height: Sizes.controlMd, paddingInline: Spacing[4] } }
      },
      { default: "md" }
    )
  }
})
