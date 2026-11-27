import * as Style from "@weft/design-system/Style"
import * as TokenColor from "@weft/design-system/TokenColor"
import { Colors, Font, Motion, Radius, Size, Spacing, Stroke, Text } from "../../platform/token/contract.token.ts"
import { SortableListParts } from "./sortable-list.parts.constant.ts"

export const SortableListStyle = Style.make(SortableListParts)({
  base: {
    list: {
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: Spacing[1],
      width: "100%",
      maxWidth: Size.column,
      margin: 0,
      padding: 0,
      listStyle: "none",
      fontFamily: Font.body,
      fontSize: Text.sm,
      color: Colors.fg,
      states: { disabled: { opacity: 0.6 } }
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: Spacing[2],
      paddingBlock: Spacing[2],
      paddingInline: Spacing[2],
      background: Colors.surface,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border,
      borderRadius: Radius.control,
      transitionProperty: "border-color, opacity",
      transitionDuration: Motion.fast,
      states: {
        moving: { opacity: 0.6, borderColor: Colors.ring },
        dropBefore: { borderTopColor: Colors.accent, borderTopWidth: Stroke.focus },
        dropAfter: { borderBottomColor: Colors.accent, borderBottomWidth: Stroke.focus }
      }
    },
    handle: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: Size.controlSm,
      height: Size.controlSm,
      padding: 0,
      color: Colors.fgMuted,
      background: TokenColor.makeAlpha(Colors.surface, 0),
      borderWidth: 0,
      borderRadius: Radius.control,
      cursor: "grab",
      touchAction: "none",
      states: {
        hover: { background: Colors.surfaceMuted, color: Colors.fg },
        focusVisible: { outlineStyle: "solid", outlineWidth: Stroke.focus, outlineColor: Colors.ring },
        moving: { cursor: "grabbing" },
        disabled: { cursor: "not-allowed" }
      }
    },
    status: { position: "absolute", overflow: "hidden", clipPath: "inset(50%)", whiteSpace: "nowrap" }
  }
})
