import * as Style from "@weft/design-system/Style"
import * as TokenLength from "@weft/design-system/TokenLength"
import * as Variant from "@weft/design-system/Variant"
import { OrientationSchema } from "../../platform/scale/scales.schema.ts"
import { Colors, Font, Motion, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { RadioGroupParts } from "./radio-group.parts.constant.ts"

export const RadioGroupStyle = Style.make(RadioGroupParts)({
  base: {
    root: { display: "flex", gap: Spacing[3], fontFamily: Font.body, fontSize: Text.sm, color: Colors.fg },
    item: { display: "inline-flex", alignItems: "center", gap: Spacing[2], cursor: "pointer" },
    radio: {
      display: "inline-grid",
      placeItems: "center",
      flexShrink: 0,
      width: Size.check,
      height: Size.check,
      padding: 0,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.full,
      cursor: "pointer",
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
        checked: { borderColor: Colors.accent },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    indicator: {
      width: TokenLength.makeCalc`${Size.check} / 2`,
      height: TokenLength.makeCalc`${Size.check} / 2`,
      background: Colors.accent,
      borderRadius: Radius.full
    }
  },
  variants: {
    orientation: Variant.make(
      OrientationSchema,
      {
        horizontal: { root: { flexDirection: "row", flexWrap: "wrap" } },
        vertical: { root: { flexDirection: "column" } }
      },
      { default: "vertical" }
    )
  }
})
