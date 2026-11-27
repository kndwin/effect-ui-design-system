import * as Style from "@acme/design-system/Style"
import * as TokenColor from "@acme/design-system/TokenColor"
import * as TokenLength from "@acme/design-system/TokenLength"
import * as Variant from "@acme/design-system/Variant"
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
import { SelectParts } from "./select.parts.constant.ts"

export const SelectStyle = Style.make(SelectParts)({
  base: {
    root: { display: "inline-flex", width: "100%", maxWidth: Size.field },
    trigger: {
      boxSizing: "border-box",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[2],
      width: "100%",
      paddingInline: Spacing[3],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      cursor: "pointer",
      transitionProperty: "border-color",
      transitionDuration: Motion.fast,
      states: {
        hover: { borderColor: Colors.fgMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        open: { borderColor: Colors.accent },
        placeholder: { color: Colors.fgMuted },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    value: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
    icon: { color: Colors.fgMuted, fontSize: Text.xs },
    positioner: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      overflow: "visible"
    },
    popup: {
      boxSizing: "border-box",
      minWidth: TokenLength.makeCalc`var(--anchor-width)`,
      maxHeight: Size.popup,
      overflowY: "auto",
      padding: Spacing[1],
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      boxShadow: Shadow.control,
      outlineStyle: "none"
    },
    item: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Spacing[2],
      paddingBlock: Spacing[2],
      paddingInline: Spacing[2],
      borderRadius: Radius.control,
      cursor: "pointer",
      outlineStyle: "none",
      states: {
        highlighted: { background: Colors.surfaceMuted },
        selected: { fontWeight: Weight.semibold },
        disabled: { opacity: 0.5, cursor: "not-allowed" }
      }
    },
    indicator: { color: Colors.accent }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      { sm: { trigger: { height: Size.controlSm } }, md: { trigger: { height: Size.controlMd } } },
      { default: "md" }
    )
  }
})
