import * as Style from "@acme/design-system/Style"
import { Colors, Font, Motion, Radius, Size, Spacing, Text, Weight } from "../../platform/token/contract.token.ts"
import { ProgressParts } from "./progress.parts.constant.ts"

export const ProgressStyle = Style.make(ProgressParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[2],
      width: Size.field,
      maxWidth: "100%",
      fontFamily: Font.body
    },
    header: { display: "flex", justifyContent: "space-between", gap: Spacing[2], fontSize: Text.sm },
    label: { fontWeight: Weight.medium, color: Colors.fg },
    value: { color: Colors.fgMuted, fontVariantNumeric: "tabular-nums" },
    track: {
      position: "relative",
      height: Size.sliderTrack,
      overflow: "hidden",
      background: Colors.surfaceMuted,
      borderRadius: Radius.full
    },
    indicator: {
      position: "absolute",
      top: 0,
      background: Colors.accent,
      borderRadius: Radius.full,
      transitionProperty: "width",
      transitionDuration: Motion.fast,
      states: { indeterminate: { width: "100%", opacity: 0.35 } }
    }
  }
})
