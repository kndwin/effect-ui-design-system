import * as Style from "@weft/design-system/Style"
import { Colors, Radius, Shadow, Spacing, Stroke } from "../../platform/token/contract.token.ts"
import { ToolbarParts } from "./toolbar.parts.constant.ts"

export const ToolbarStyle = Style.make(ToolbarParts)({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: Spacing[1],
      padding: Spacing[1],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      boxShadow: Shadow.control
    },
    separator: { alignSelf: "stretch", width: Stroke.border, marginInline: Spacing[1], background: Colors.border }
  }
})
