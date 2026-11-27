import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { OrientationSchema } from "../../platform/scale/scales.schema.ts"
import { Colors, Stroke } from "../../platform/token/contract.token.ts"
import { SeparatorParts } from "./separator.parts.constant.ts"

export const SeparatorStyle = Style.make(SeparatorParts)({
  base: { root: { flexShrink: 0, background: Colors.border } },
  variants: {
    orientation: Variant.make(
      OrientationSchema,
      {
        horizontal: { root: { width: "100%", height: Stroke.border } },
        vertical: { root: { alignSelf: "stretch", width: Stroke.border, minHeight: "100%" } }
      },
      { default: "horizontal" }
    )
  }
})
