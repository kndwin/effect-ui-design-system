import * as Style from "@acme/design-system/Style"
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
import { FileDropParts } from "./file-drop.parts.constant.ts"

export const FileDropStyle = Style.make(FileDropParts)({
  base: {
    root: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: Spacing[2],
      width: "100%",
      maxWidth: Size.column,
      padding: Spacing[8],
      fontFamily: Font.body,
      textAlign: "center",
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "dashed",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      transitionProperty: "border-color, background-color",
      transitionDuration: Motion.fast,
      states: {
        over: { borderColor: Colors.accent, background: Colors.surfaceMuted },
        disabled: { opacity: 0.6 }
      }
    },
    label: { fontSize: Text.sm, fontWeight: Weight.medium, color: Colors.fg },
    trigger: {
      height: Size.controlSm,
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
        hover: { background: Colors.surfaceMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        disabled: { cursor: "not-allowed" }
      }
    },
    hint: { margin: 0, fontSize: Text.xs, color: Colors.fgMuted }
  }
})
