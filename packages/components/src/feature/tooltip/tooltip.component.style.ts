import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import { Colors, Font, Radius, Size, Spacing, Text } from "../../platform/token/contract.token.ts"
import { TooltipParts } from "./tooltip.parts.constant.ts"

export const TooltipStyle = Style.make(TooltipParts)({
  base: {
    positioner: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      overflow: "visible"
    },
    popup: {
      maxWidth: Size.tooltip,
      paddingBlock: Spacing[1],
      paddingInline: Spacing[2],
      fontFamily: Font.body,
      fontSize: Text.xs,
      lineHeight: 1.4,
      color: Colors.surface,
      background: Colors.fg,
      borderRadius: Radius.control
    }
  }
})
