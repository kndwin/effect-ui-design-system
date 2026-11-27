import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as Variant from "@acme/design-system/Variant"
import { ControlSizeSchema } from "../../platform/scale/scales.schema.ts"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Size,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"
import { ToggleParts } from "./toggle.parts.constant.ts"

export const ToggleStyle = Style.make(ToggleParts)({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: Spacing[2],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: TokenColor.makeAlpha(Colors.border, 0),
      borderRadius: Radius.control,
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: Motion.fast,
      states: {
        hover: { background: Colors.surfaceMuted, color: Colors.fg },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        pressed: { background: Colors.surfaceMuted, color: Colors.fg, borderColor: Colors.border },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      {
        sm: { root: { minWidth: Size.controlSm, height: Size.controlSm, paddingInline: Spacing[2] } },
        md: { root: { minWidth: Size.controlMd, height: Size.controlMd, paddingInline: Spacing[3] } }
      },
      { default: "md" }
    )
  }
})
