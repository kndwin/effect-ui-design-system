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
import { DateFieldParts } from "./date-field.parts.constant.ts"

const focusRing = {
  outlineStyle: "solid",
  outlineWidth: Stroke.focus,
  outlineOffset: Stroke.focusOffset,
  outlineColor: Colors.ring
} as const

export const DateFieldStyle = Style.make(DateFieldParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: "100%",
      maxWidth: Size.field,
      fontFamily: Font.body,
      states: { disabled: { opacity: 0.6 } }
    },
    label: { fontSize: Text.sm, fontWeight: Weight.medium, color: Colors.fg },
    group: { display: "flex", gap: Spacing[2] },
    input: {
      boxSizing: "border-box",
      flexGrow: 1,
      minWidth: 0,
      height: Size.controlMd,
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontVariantNumeric: "tabular-nums",
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      transitionProperty: "border-color",
      transitionDuration: Motion.fast,
      states: {
        hover: { borderColor: Colors.fgMuted },
        focusVisible: focusRing,
        invalid: { borderColor: Colors.danger },
        disabled: { cursor: "not-allowed" }
      }
    },
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: Size.controlMd,
      height: Size.controlMd,
      padding: 0,
      color: Colors.fgMuted,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
        hover: { background: Colors.surfaceMuted, color: Colors.fg },
        focusVisible: focusRing,
        open: { background: Colors.surfaceMuted, color: Colors.fg },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
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
      padding: Spacing[3],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      boxShadow: Shadow.overlay,
      outlineStyle: "none",
      transformOrigin: "var(--transform-origin)",
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "scale(0.96)" },
        ending: { opacity: 0, transform: "scale(0.96)" }
      }
    }
  }
})
