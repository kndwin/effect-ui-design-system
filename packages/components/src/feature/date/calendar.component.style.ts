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
import { CalendarParts } from "./calendar.parts.constant.ts"

export const CalendarStyle = Style.make(CalendarParts)({
  base: {
    root: {
      display: "inline-flex",
      flexDirection: "column",
      gap: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      states: { disabled: { opacity: 0.6 } }
    },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: Spacing[2] },
    heading: { margin: 0, fontSize: Text.sm, fontWeight: Weight.semibold },
    nav: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: Size.controlSm,
      height: Size.controlSm,
      padding: 0,
      fontSize: Text.md,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
        hover: { background: Colors.surfaceMuted, color: Colors.fg },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        disabled: { opacity: 0.4, cursor: "not-allowed" }
      }
    },
    grid: { borderCollapse: "collapse" },
    weekday: {
      padding: 0,
      paddingBottom: Spacing[1],
      fontSize: Text.xs,
      fontWeight: Weight.regular,
      color: Colors.fgMuted
    },
    cell: { padding: 0 },
    day: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: Size.controlSm,
      height: Size.controlSm,
      padding: 0,
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontVariantNumeric: "tabular-nums",
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      borderRadius: Radius.control,
      cursor: "pointer",
      transitionProperty: "background-color, color",
      transitionDuration: Motion.fast,
      states: {
        hover: { background: Colors.surfaceMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        today: { fontWeight: Weight.semibold, color: Colors.accent },
        outside: { color: Colors.fgMuted, opacity: 0.6 },
        inRange: { background: Colors.surfaceMuted, borderRadius: 0 },
        selected: { background: Colors.accent, color: Colors.accentFg },
        rangeStart: { background: Colors.accent, color: Colors.accentFg },
        rangeEnd: { background: Colors.accent, color: Colors.accentFg },
        unavailable: { color: Colors.fgMuted, textDecorationLine: "line-through", cursor: "not-allowed" },
        disabled: { opacity: 0.4, cursor: "not-allowed" }
      }
    }
  }
})
