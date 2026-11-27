import * as Style from "@acme/design-system/Style"
import { Colors, Font, Radius, Size, Spacing, Stroke, Text, Weight } from "../../platform/token/contract.token.ts"
import { FieldsetParts } from "./fieldset.parts.constant.ts"

export const FieldsetStyle = Style.make(FieldsetParts)({
  base: {
    root: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[4],
      width: "100%",
      maxWidth: Size.column,
      margin: 0,
      padding: Spacing[4],
      fontFamily: Font.body,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      states: { disabled: { opacity: 0.6 } }
    },
    legend: { fontSize: Text.sm, fontWeight: Weight.semibold, color: Colors.fg }
  }
})
