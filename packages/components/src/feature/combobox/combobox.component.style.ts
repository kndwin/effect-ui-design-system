import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import * as TokenLength from "@weft/design-system/TokenLength"
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
import { ComboboxParts } from "./combobox.parts.constant.ts"

export const ComboboxStyle = Style.make(ComboboxParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: "100%",
      maxWidth: Size.field,
      fontFamily: Font.body
    },
    label: { fontSize: Text.sm, fontWeight: Weight.medium, color: Colors.fg },
    group: {
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      height: Size.controlMd,
      paddingInlineStart: Spacing[3],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      transitionProperty: "border-color",
      transitionDuration: Motion.fast,
      states: { focused: { borderColor: Colors.ring }, disabled: { opacity: 0.5 } }
    },
    input: {
      flexGrow: 1,
      minWidth: 0,
      height: "100%",
      padding: 0,
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      outlineStyle: "none"
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: Size.controlMd,
      height: "100%",
      padding: 0,
      fontSize: Text.sm,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      cursor: "pointer",
      states: {
        hover: { color: Colors.fg },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring }
      }
    },
    positioner: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      overflow: "visible"
    },
    popup: {
      boxSizing: "border-box",
      width: TokenLength.makeCalc`var(--anchor-width)`,
      maxHeight: Size.popup,
      overflowY: "auto",
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
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "scale(0.98)" },
        ending: { opacity: 0, transform: "scale(0.98)" }
      }
    },
    list: { display: "flex", flexDirection: "column" },
    empty: { padding: Spacing[2], color: Colors.fgMuted, states: { blank: { display: "none" } } },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[2],
      paddingBlock: Spacing[2],
      paddingInline: Spacing[2],
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
        highlighted: { background: Colors.surfaceMuted },
        selected: { fontWeight: Weight.medium },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    indicator: { color: Colors.accent }
  }
})
