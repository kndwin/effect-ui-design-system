import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size,
  Spacing,
  Stroke,
  Text
} from "../../platform/token/contract.token.ts"
import { MenuParts } from "./menu.parts.constant.ts"

export const MenuStyle = Style.make(MenuParts, { extend: ["dangerItem"] })({
  base: {
    positioner: { margin: 0, borderWidth: 0, background: TokenColor.makeAlpha(Colors.surface, 0), overflow: "visible" },
    popup: {
      boxSizing: "border-box",
      minWidth: Size.column,
      padding: Spacing[1],
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
    item: {
      display: "flex",
      alignItems: "center",
      paddingBlock: Spacing[2],
      paddingInline: Spacing[2],
      borderRadius: Radius.control,
      cursor: "pointer",
      outlineStyle: "none",
      userSelect: "none",
      states: {
        highlighted: { background: Colors.surfaceMuted },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    dangerItem: { color: Colors.danger },
    separator: { height: Stroke.border, marginBlock: Spacing[1], background: Colors.border }
  }
})
