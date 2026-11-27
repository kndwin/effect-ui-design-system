import * as Style from "@acme/design-system/Style"
import { Colors, Radius, Spacing, Stroke } from "../../platform/token/contract.token.ts"
import { ToggleGroupParts } from "./toggle-group.parts.constant.ts"

export const ToggleGroupStyle = Style.make(ToggleGroupParts)({
  base: {
    root: {
      display: "inline-flex",
      gap: Spacing[1],
      padding: Spacing[1],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      states: { vertical: { flexDirection: "column" }, disabled: { opacity: 0.6 } }
    }
  }
})
