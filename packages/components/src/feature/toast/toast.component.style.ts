import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"
import { ToastParts } from "./toast.parts.constant.ts"

export const ToastStyle = Style.make(ToastParts)({
  base: {
    viewport: {
      position: "fixed",
      inset: "auto",
      right: Spacing[4],
      bottom: Spacing[4],
      margin: 0,
      padding: 0,
      borderWidth: 0,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      overflow: "visible",
      display: "flex",
      flexDirection: "column-reverse",
      gap: Spacing[2],
      width: Size.column,
      maxWidth: "100%"
    },
    root: {
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[1],
      paddingBlock: Spacing[3],
      paddingInline: Spacing[4],
      paddingInlineEnd: Spacing[8],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderLeftWidth: Spacing[1],
      borderRadius: Radius.control,
      boxShadow: Shadow.overlay,
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "translateY(25%)" },
        ending: { opacity: 0, transform: "translateX(25%)" },
        success: { borderLeftColor: Colors.accent },
        error: { borderLeftColor: Colors.danger },
        limited: { display: "none" }
      }
    },
    title: { fontWeight: Weight.semibold },
    description: { color: Colors.fgMuted, lineHeight: 1.4 },
    close: { position: "absolute", top: Spacing[2], right: Spacing[2] }
  }
})
