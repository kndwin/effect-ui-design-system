import * as Style from "@acme/ds/Style"
import * as Variant from "@acme/ds/Variant"
import { Grid, GridSpan } from "@acme/ds/kit/layout"
import { Columns, Space, Span } from "../scales.pure.ts"
import { Size } from "../contract.token.ts"
import { space } from "./space.pure.ts"

const cols = (n: number) => ({ root: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } })

export const GridStyle = Style.make(Grid)({
  base: { root: { display: "grid", minWidth: 0 } },
  variants: {
    columns: Variant.make(
      Columns,
      {
        "1": cols(1),
        "2": cols(2),
        "3": cols(3),
        "4": cols(4),
        "5": cols(5),
        // as many Size.column-wide columns as fit
        auto: { root: { gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Size.column}), 1fr))` } }
      },
      { default: "1" }
    ),
    gap: Variant.make(
      Space,
      space((gap) => ({ gap })),
      { default: "0" }
    ),
    // collapse to one column below the `narrow` breakpoint
    stack: Variant.flag({ root: { media: { narrow: { gridTemplateColumns: "minmax(0, 1fr)" } } } })
  }
})

export const GridSpanStyle = Style.make(GridSpan)({
  base: { root: { minWidth: 0 } },
  variants: {
    span: Variant.make(Span, {
      "1": { root: { gridColumn: "span 1" } },
      "2": { root: { gridColumn: "span 2" } },
      "3": { root: { gridColumn: "span 3" } },
      "4": { root: { gridColumn: "span 4" } },
      full: { root: { gridColumn: "1 / -1" } }
    })
  }
})
