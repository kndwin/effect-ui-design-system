import * as Style from "@acme/design-system/Style"
import { Colors, Motion, Radius, Size, Spacing, Stroke } from "../../platform/token/contract.token.ts"
import { ScrollAreaParts } from "./scroll-area.parts.constant.ts"

export const ScrollAreaStyle = Style.make(ScrollAreaParts)({
  base: {
    root: {
      width: "100%",
      height: Size.popup,
      overflow: "hidden",
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control
    },
    viewport: { height: "100%", outlineStyle: "none" },
    content: { padding: Spacing[4] },
    scrollbar: {
      width: Spacing[2],
      padding: Stroke.border,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: Motion.fast,
      states: { scrolling: { opacity: 1 }, hovering: { opacity: 1 } }
    },
    thumb: { width: "100%", background: Colors.border, borderRadius: Radius.full }
  }
})
