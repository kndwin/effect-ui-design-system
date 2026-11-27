import * as Style from "@weft/design-system/Style"
import * as Variant from "@weft/design-system/Variant"
import { CenterParts } from "./layout.parts.constant.ts"

export const CenterStyle = Style.make(CenterParts)({
  base: { root: { display: "grid", placeItems: "center", minWidth: 0 } },
  variants: { fill: Variant.makeFlag({ root: { width: "100%", height: "100%" } }) }
})
