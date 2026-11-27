import * as Style from "@weft/design-system/Style"
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
import { OtpFieldParts } from "./otp-field.parts.constant.ts"

export const OtpFieldStyle = Style.make(OtpFieldParts)({
  base: {
    root: { display: "inline-flex", gap: Spacing[2], states: { disabled: { opacity: 0.6 } } },
    slot: {
      boxSizing: "border-box",
      width: Size.controlMd,
      height: Size.controlMd,
      padding: 0,
      textAlign: "center",
      fontFamily: Font.mono,
      fontSize: Text.lg,
      fontWeight: Weight.semibold,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      transitionProperty: "border-color",
      transitionDuration: Motion.fast,
      states: {
        hover: { borderColor: Colors.fgMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        filled: { borderColor: Colors.fgMuted },
        invalid: { borderColor: Colors.danger }
      }
    }
  }
})
