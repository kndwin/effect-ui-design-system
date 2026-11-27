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
import { PopoverParts } from "./popover.parts.constant.ts"

export const PopoverStyle = Style.make(PopoverParts)({
  base: {
    positioner: { margin: 0, borderWidth: 0, background: TokenColor.makeAlpha(Colors.surface, 0), overflow: "visible" },
    popup: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: Size.column,
      maxWidth: "100%",
      padding: Spacing[4],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      boxShadow: Shadow.overlay,
      outlineStyle: "none",
      transformOrigin: "var(--transform-origin)",
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "scale(0.96)" },
        ending: { opacity: 0, transform: "scale(0.96)" }
      }
    },
    title: { margin: 0, fontSize: Text.sm, fontWeight: Weight.semibold },
    description: { margin: 0, color: Colors.fgMuted, lineHeight: 1.5 },
    body: { display: "flex", flexDirection: "column", gap: Spacing[2] }
  }
})
