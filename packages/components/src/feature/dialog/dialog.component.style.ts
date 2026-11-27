import * as Style from "@weft/design-system/Style"
import * as Variant from "@weft/design-system/Variant"
import { ControlSizeSchema } from "../../platform/scale/scales.schema.ts"
import {
  Colors,
  Font,
  Motion,
  Radius,
  Shadow,
  Size,
  Spacing,
  Stroke,
  Text,
  Weight
} from "../../platform/token/contract.token.ts"
import { DialogParts } from "./dialog.parts.constant.ts"

export const DialogStyle = Style.make(DialogParts)({
  base: {
    backdrop: {
      position: "fixed",
      inset: 0,
      background: Colors.overlay,
      transitionProperty: "opacity",
      transitionDuration: Motion.fast,
      states: { starting: { opacity: 0 }, ending: { opacity: 0 } }
    },
    viewport: {
      position: "fixed",
      inset: 0,
      display: "grid",
      placeItems: "center",
      padding: Spacing[4],
      overflowY: "auto"
    },
    popup: {
      boxSizing: "border-box",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[4],
      width: "100%",
      padding: Spacing[6],
      fontFamily: Font.body,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.container,
      boxShadow: Shadow.overlay,
      outlineStyle: "none",
      transitionProperty: "opacity, transform",
      transitionDuration: Motion.fast,
      states: {
        starting: { opacity: 0, transform: "scale(0.96)" },
        ending: { opacity: 0, transform: "scale(0.96)" }
      }
    },
    header: { display: "flex", flexDirection: "column", gap: Spacing[2], paddingInlineEnd: Spacing[6] },
    title: { margin: 0, fontSize: Text.lg, fontWeight: Weight.semibold, lineHeight: 1.3 },
    description: { margin: 0, fontSize: Text.sm, color: Colors.fgMuted, lineHeight: 1.5 },
    body: { fontSize: Text.sm, lineHeight: 1.5 },
    footer: { display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: Spacing[2] },
    close: { position: "absolute", top: Spacing[3], right: Spacing[3] }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      { sm: { popup: { maxWidth: Size.field } }, md: { popup: { maxWidth: Size.dialog } } },
      { default: "md" }
    )
  }
})
