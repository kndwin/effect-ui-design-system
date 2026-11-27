import * as Style from "@acme/design-system/Style"
import * as TokenLength from "@acme/design-system/TokenLength"
import { Colors, Radius, Shadow, Size, Stroke } from "../../platform/token/contract.token.ts"
import { SliderParts } from "./slider.parts.constant.ts"

export const SliderStyle = Style.make(SliderParts)({
  base: {
    root: { width: Size.field, maxWidth: "100%", states: { disabled: { opacity: 0.5 } } },
    control: {
      display: "flex",
      alignItems: "center",
      height: Size.sliderThumb,
      touchAction: "none",
      cursor: "pointer"
    },
    track: {
      position: "relative",
      flexGrow: 1,
      height: Size.sliderTrack,
      background: Colors.border,
      borderRadius: Radius.full
    },
    indicator: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: TokenLength.makeCalc`var(--slider-indicator-start)`,
      width: TokenLength.makeCalc`var(--slider-indicator-size)`,
      background: Colors.accent,
      borderRadius: Radius.full
    },
    thumb: {
      position: "absolute",
      top: TokenLength.makeCalc`${Size.sliderTrack} / 2`,
      left: TokenLength.makeCalc`var(--slider-thumb-position)`,
      width: Size.sliderThumb,
      height: Size.sliderThumb,
      transform: "translate(-50%, -50%)",
      background: Colors.surface,
      borderWidth: Stroke.focus,
      borderStyle: "solid",
      borderColor: Colors.accent,
      borderRadius: Radius.full,
      boxShadow: Shadow.control,
      states: {
        focus: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        dragging: { cursor: "grabbing" }
      }
    }
  }
})
