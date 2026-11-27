import * as Style from "@weft/design-system/Style"
import { Colors, Font, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { VirtualListParts } from "./virtual-list.parts.constant.ts"

export const VirtualListStyle = Style.make(VirtualListParts)({
  base: {
    viewport: {
      boxSizing: "border-box",
      width: "100%",
      maxWidth: Size.column,
      height: Size.popup,
      overflowY: "auto",
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      states: {
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        }
      }
    },
    list: { margin: 0, padding: 0, listStyle: "none" },
    item: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      height: Size.controlMd,
      paddingInline: Spacing[3],
      fontVariantNumeric: "tabular-nums",
      borderBottomWidth: Stroke.border,
      borderBottomStyle: "solid",
      borderBottomColor: Colors.border
    }
  }
})
