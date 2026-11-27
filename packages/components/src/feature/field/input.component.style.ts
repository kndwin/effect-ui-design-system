import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { ControlSizeSchema } from "../../platform/scale/scales.schema.ts"
import { Colors, Font, Motion, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { InputParts } from "./input.parts.constant.ts"

export const InputStyle = Style.make(InputParts)({
  base: {
    root: {
      boxSizing: "border-box",
      width: "100%",
      minWidth: 0,
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      paddingInline: Spacing[3],
      transitionProperty: "border-color, box-shadow",
      transitionDuration: Motion.fast,
      states: {
        hover: { borderColor: Colors.fgMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        invalid: { borderColor: Colors.danger },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      { sm: { root: { height: Size.controlSm } }, md: { root: { height: Size.controlMd } } },
      { default: "md" }
    )
  }
})
