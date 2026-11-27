import * as Style from "@weft/design-system/Style"
import * as Variant from "@weft/design-system/Variant"
import { SwatchParts } from "./swatch.parts.constant.ts"
import { Colors, Radius, Spacing, Stroke } from "../../platform/token/contract.token.ts"
import { ControlSizeSchema } from "../../platform/scale/scales.schema.ts"

export const SwatchStyle = Style.make(SwatchParts)({
  base: {
    root: {
      display: "inline-block",
      flexShrink: 0,
      verticalAlign: "middle",
      borderRadius: Radius.avatarSquare,
      borderWidth: Stroke.border,
      borderStyle: "solid",
      borderColor: Colors.border
    }
  },
  variants: {
    size: Variant.make(
      ControlSizeSchema,
      {
        sm: { root: { width: Spacing[3], height: Spacing[3] } },
        md: { root: { width: Spacing[4], height: Spacing[4] } }
      },
      { default: "md" }
    ),
    round: Variant.makeFlag({ root: { borderRadius: Radius.full } })
  }
})
