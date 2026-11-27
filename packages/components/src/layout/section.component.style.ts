import * as Style from "@acme/ds/Style"
import * as Variant from "@acme/ds/Variant"
import { Section } from "@acme/ds/kit/layout"
import { Colors, Radius, Stroke } from "../contract.token.ts"
import { Space, Surface } from "../scales.pure.ts"
import { space } from "./space.pure.ts"

export const SectionStyle = Style.make(Section)({
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
    /** a rule under the section */
    divided: Variant.flag({
      root: { borderBottomWidth: Stroke.border, borderBottomStyle: "solid", borderBottomColor: Colors.border }
    })
  }
})
