import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Size,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"
import { NumberFieldParts } from "./number-field.parts.constant.ts"

export const NumberFieldStyle = Style.make(NumberFieldParts)({
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
    label: { fontSize: Text.sm, fontWeight: Weight.medium, color: Colors.fg, cursor: "ew-resize" },
    group: {
      display: "flex",
      height: Size.controlMd,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      overflow: "hidden",
      transitionProperty: "border-color",
      transitionDuration: Motion.fast,
      states: { focused: { borderColor: Colors.ring }, invalid: { borderColor: Colors.danger } }
    },
    input: {
      flexGrow: 1,
      minWidth: 0,
      textAlign: "center",
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontVariantNumeric: "tabular-nums",
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      outlineStyle: "none"
    },
    step: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: Size.controlMd,
      fontSize: Text.md,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      cursor: "pointer",
      states: {
        hover: { background: Colors.surfaceMuted, color: Colors.fg },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring },
        disabled: { opacity: 0.4, cursor: "not-allowed" }
      }
    }
  }
})
