import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import * as TokenLength from "@weft/design-system/TokenLength"
import * as Variant from "@weft/design-system/Variant"
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
import { CollapsibleParts } from "./collapsible.parts.constant.ts"

export const CollapsibleStyle = Style.make(CollapsibleParts)({
  base: {
    root: { width: "100%", maxWidth: Size.field, fontFamily: Font.body },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[2],
      width: "100%",
      paddingBlock: Spacing[2],
      paddingInline: 0,
      fontFamily: Font.body,
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fg,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      borderRadius: Radius.control,
      cursor: "pointer",
      states: {
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
      height: TokenLength.makeCalc`var(--collapsible-panel-height)`,
      overflow: "hidden",
      fontSize: Text.sm,
      lineHeight: 1.6,
      color: Colors.fgMuted,
      transitionProperty: "height",
      transitionDuration: Motion.fast,
      states: { starting: { height: 0 }, ending: { height: 0 } }
    }
  },
  variants: { fill: Variant.makeFlag({ root: { maxWidth: "none" } }) }
})
