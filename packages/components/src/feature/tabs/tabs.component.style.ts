import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as TokenLength from "@acme/design-system/TokenLength"
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
import { TabsParts } from "./tabs.parts.constant.ts"

export const TabsStyle = Style.make(TabsParts)({
  base: {
    root: { display: "flex", flexDirection: "column", gap: Spacing[4], width: "100%", fontFamily: Font.body },
    list: {
      position: "relative",
      display: "flex",
      gap: Spacing[1],
      borderBottomWidth: Stroke.border,
      borderBottomStyle: "solid",
      borderBottomColor: Colors.border
    },
    tab: {
      height: Size.controlMd,
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      borderRadius: Radius.control,
      cursor: "pointer",
      transitionProperty: "color",
      transitionDuration: Motion.fast,
      states: {
        hover: { color: Colors.fg },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        active: { color: Colors.fg },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    indicator: {
      position: "absolute",
      bottom: TokenLength.makeCalc`-1 * ${Stroke.border}`,
      left: TokenLength.makeCalc`var(--active-tab-left)`,
      width: TokenLength.makeCalc`var(--active-tab-width)`,
      height: Stroke.focus,
      background: Colors.accent,
      borderRadius: Radius.full,
      transitionProperty: "left, width",
      transitionDuration: Motion.fast
    },
    panel: { fontSize: Text.sm, color: Colors.fg, lineHeight: 1.6, outlineStyle: "none" }
  }
})
