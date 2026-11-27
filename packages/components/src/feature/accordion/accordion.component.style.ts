import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as TokenLength from "@acme/design-system/TokenLength"
import { Colors, Font, Motion, Size, Spacing, Stroke, Text, Weight } from "../../platform/token/contract.token.ts"
import { AccordionParts } from "./accordion.parts.constant.ts"

export const AccordionStyle = Style.make(AccordionParts)({
  base: {
    root: { width: "100%", maxWidth: Size.content, fontFamily: Font.body },
    item: { borderBottomWidth: Stroke.border, borderBottomStyle: "solid", borderBottomColor: Colors.border },
    header: { margin: 0 },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[3],
      width: "100%",
      paddingBlock: Spacing[4],
      paddingInline: 0,
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      textAlign: "left",
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      cursor: "pointer",
      states: {
        hover: { textDecoration: "underline" },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    icon: { color: Colors.fgMuted, transitionProperty: "transform", transitionDuration: Motion.fast },
    panel: {
      height: TokenLength.makeCalc`var(--accordion-panel-height)`,
      overflow: "hidden",
      transitionProperty: "height",
      transitionDuration: Motion.fast,
      states: { starting: { height: 0 }, ending: { height: 0 } }
    },
    content: { paddingBottom: Spacing[4], fontSize: Text.sm, lineHeight: 1.6, color: Colors.fgMuted }
  }
})
