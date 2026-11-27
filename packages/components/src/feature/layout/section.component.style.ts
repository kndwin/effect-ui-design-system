import * as Style from "@weft/design-system/Style"
import * as Variant from "@weft/design-system/Variant"
import { SectionParts } from "./layout.parts.constant.ts"
import { Colors, Radius, Stroke } from "../../platform/token/contract.token.ts"
import { SpaceSchema, SurfaceSchema } from "../../platform/scale/scales.schema.ts"
import { composeSpaceVariants } from "./space.pure.ts"

export const SectionStyle = Style.make(SectionParts)({
  base: { root: { display: "flex", flexDirection: "column", minWidth: 0, boxSizing: "border-box" } },
  variants: {
    gap: Variant.make(SpaceSchema, composeSpaceVariants({ property: "gap" }), { default: "0" }),
    pad: Variant.make(SpaceSchema, composeSpaceVariants({ property: "padding" }), { default: "0" }),
    surface: Variant.make(
      SurfaceSchema,
      {
        none: {},
        base: { root: { background: Colors.surface, color: Colors.fg } },
        muted: { root: { background: Colors.surfaceMuted, color: Colors.fg, borderRadius: Radius.control } },
        card: {
          root: {
            background: Colors.surface,
            color: Colors.fg,
            borderWidth: Stroke.border,
            borderStyle: "solid",
            borderColor: Colors.border,
            borderRadius: Radius.container,
            overflow: "hidden"
          }
        }
      },
      { default: "none" }
    ),

    divided: Variant.makeFlag({
      root: { borderBottomWidth: Stroke.border, borderBottomStyle: "solid", borderBottomColor: Colors.border }
    })
  }
})
