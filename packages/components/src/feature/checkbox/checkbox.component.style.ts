import * as Style from "@weft/design-system/Style"
import { Colors, Font, Motion, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { CheckboxParts } from "./checkbox.parts.constant.ts"

export const CheckboxStyle = Style.make(CheckboxParts)({
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: Spacing[2],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      cursor: "pointer"
    },
    box: {
      display: "inline-grid",
      placeItems: "center",
      flexShrink: 0,
      width: Size.check,
      height: Size.check,
      padding: 0,
      color: Colors.accentFg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.check,
      cursor: "pointer",
      transitionProperty: "background-color, border-color",
      transitionDuration: Motion.fast,
      states: {
        hover: { borderColor: Colors.fgMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        checked: { background: Colors.accent, borderColor: Colors.accent },
        indeterminate: { background: Colors.accent, borderColor: Colors.accent },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    indicator: {
      display: "none",
      width: "100%",
      height: "100%",
      states: { checked: { display: "block" }, indeterminate: { display: "block" } }
    }
  }
})
