import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { OrientationSchema } from "../../platform/scale/scales.schema.ts"
import { Colors, Font, Motion, Radius, Spacing, Stroke, Text, Weight } from "../../platform/token/contract.token.ts"
import { NavigationMenuParts } from "./navigation-menu.parts.constant.ts"

export const NavigationMenuStyle = Style.make(NavigationMenuParts)({
  base: {
    root: { fontFamily: Font.body },
    list: { display: "flex", gap: Spacing[1], margin: 0, padding: 0, listStyle: "none" },
    item: {},
    link: {
      display: "inline-flex",
      alignItems: "center",
      paddingBlock: Spacing[2],
      paddingInline: Spacing[3],
      fontSize: Text.sm,
      fontWeight: Weight.medium,
      color: Colors.fgMuted,
      textDecoration: "none",
      borderRadius: Radius.control,
      transitionProperty: "background-color, color",
      transitionDuration: Motion.fast,
      states: {
        hover: { color: Colors.fg, background: Colors.surfaceMuted },
        focusVisible: {
          outlineStyle: "solid",
          outlineWidth: Stroke.focus,
          outlineOffset: Stroke.focusOffset,
          outlineColor: Colors.ring
        },
        active: { color: Colors.fg, background: Colors.surfaceMuted }
      }
    }
  },
  variants: {
    orientation: Variant.make(
      OrientationSchema,
      { horizontal: { list: { flexDirection: "row" } }, vertical: { list: { flexDirection: "column" } } },
      { default: "horizontal" }
    )
  }
})
