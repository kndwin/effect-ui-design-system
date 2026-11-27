import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { CenterParts } from "./layout.parts.pure.ts"

export const CenterStyle = Style.make(CenterParts)({
  base: { root: { display: "grid", placeItems: "center", minWidth: 0 } },
  variants: { fill: Variant.flag({ root: { width: "100%", height: "100%" } }) }
})
