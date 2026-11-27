import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { SectionParts } from "./layout.parts.constant.ts"
import { Colors, Radius, Stroke } from "../contract.token.ts"
import { Space, Surface } from "../scales.schema.ts"
import { space } from "./space.pure.ts"

export const SectionStyle = Style.make(SectionParts)({
  base: { root: { display: "flex", flexDirection: "column", minWidth: 0, boxSizing: "border-box" } },
  variants: {
    gap: Variant.make(
      Space,
      space((gap) => ({ gap })),
      { default: "0" }
    ),
    pad: Variant.make(
      Space,
      space((padding) => ({ padding })),
      { default: "0" }
    ),
    surface: Variant.make(
      Surface,
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

    divided: Variant.flag({
      root: { borderBottomWidth: Stroke.border, borderBottomStyle: "solid", borderBottomColor: Colors.border }
    })
  }
})
