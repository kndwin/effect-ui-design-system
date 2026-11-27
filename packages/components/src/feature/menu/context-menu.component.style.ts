import * as Style from "@weft/design-system/Style"
import { Colors, Font, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { ContextMenuParts } from "./context-menu.parts.constant.ts"

export const ContextMenuStyle = Style.make(ContextMenuParts)({
  base: {
    area: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      maxWidth: Size.column,
      minHeight: Size.header,
      padding: Spacing[6],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fgMuted,
      borderWidth: Stroke.border,
      borderStyle: "dashed",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      userSelect: "none",
      states: { open: { borderColor: Colors.ring, color: Colors.fg } }
    }
  }
})
