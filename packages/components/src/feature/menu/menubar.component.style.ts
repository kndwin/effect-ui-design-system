import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import { Colors, Font, Radius, Size, Spacing, Stroke, Text, Weight } from "../../platform/token/contract.token.ts"
import { MenubarParts } from "./menubar.parts.constant.ts"

export const MenubarStyle = Style.make(MenubarParts)({
  base: {
    root: {
      display: "inline-flex",
      gap: Spacing[1],
      padding: Spacing[1],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control
    },
    trigger: {
      height: Size.controlSm,
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
        hover: { background: Colors.surfaceMuted },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring },
        open: { background: Colors.surfaceMuted },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    }
  }
})
