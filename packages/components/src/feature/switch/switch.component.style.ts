import * as Style from "@weft/design-system/Style"
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
  Text
} from "../../platform/token/contract.token.ts"
import { SwitchParts } from "./switch.parts.constant.ts"

export const SwitchStyle = Style.make(SwitchParts)({
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
    track: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      flexShrink: 0,
      width: Size.switchWidth,
      height: Size.switchHeight,
      padding: 0,
      background: Colors.border,
      borderWidth: 0,
      borderRadius: Radius.full,
      cursor: "pointer",
      transitionProperty: "background-color",
      transitionDuration: Motion.fast,
      states: {
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        checked: { background: Colors.accent },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    thumb: {
      display: "block",
      width: Size.switchThumb,
      height: Size.switchThumb,
      marginInline: TokenLength.makeCalc`(${Size.switchHeight} - ${Size.switchThumb}) / 2`,
      background: Colors.surface,
      borderRadius: Radius.full,
      boxShadow: Shadow.control,
      transitionProperty: "transform",
      transitionDuration: Motion.fast,
      states: {
        checked: {
          transform: `translateX(calc(${Size.switchWidth} - ${Size.switchHeight}))`,
          background: Colors.accentFg
        }
      }
    }
  }
})
