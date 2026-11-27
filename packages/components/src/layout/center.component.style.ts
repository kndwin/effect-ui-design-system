import * as Style from "@acme/ds/Style"
import * as Variant from "@acme/ds/Variant"
import { Center } from "@acme/ds/kit/layout"

export const CenterStyle = Style.make(Center)({
  base: { root: { display: "grid", placeItems: "center", minWidth: 0 } },
  variants: { fill: Variant.flag({ root: { width: "100%", height: "100%" } }) }
})
