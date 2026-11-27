import * as Style from "@weft/design-system/Style"
import { Colors, Font, Size, Spacing, Text, Weight } from "../../platform/token/contract.token.ts"
import { FieldParts } from "./field.parts.constant.ts"

export const FieldStyle = Style.make(FieldParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: "100%",
      maxWidth: Size.field,
      fontFamily: Font.body,
      states: { disabled: { opacity: 0.6 } }
    },
    label: { fontSize: Text.sm, fontWeight: Weight.medium, color: Colors.fg },
    description: { margin: 0, fontSize: Text.xs, color: Colors.fgMuted },
    error: { fontSize: Text.xs, fontWeight: Weight.medium, color: Colors.danger }
  }
})
