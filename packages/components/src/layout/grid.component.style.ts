import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { GridParts, GridSpanParts } from "./layout.parts.constant.ts"
import { ColumnsSchema, SpaceSchema, SpanSchema } from "../scales.schema.ts"
import { Size } from "../contract.token.ts"
import { composeSpaceVariants } from "./space.pure.ts"

const cols = (n: number) => ({ root: { gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` } })

export const GridStyle = Style.make(GridParts)({
  base: { root: { display: "grid", minWidth: 0 } },
  variants: {
    columns: Variant.make(
      ColumnsSchema,
      {
        "1": cols(1),
        "2": cols(2),
        "3": cols(3),
        "4": cols(4),
        "5": cols(5),

        auto: { root: { gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${Size.column}), 1fr))` } }
      },
      { default: "1" }
    ),
    gap: Variant.make(SpaceSchema, composeSpaceVariants({ property: "gap" }), { default: "0" }),

    stack: Variant.makeFlag({ root: { media: { narrow: { gridTemplateColumns: "minmax(0, 1fr)" } } } })
  }
})

export const GridSpanStyle = Style.make(GridSpanParts)({
  base: { root: { minWidth: 0 } },
  variants: {
    span: Variant.make(SpanSchema, {
      "1": { root: { gridColumn: "span 1" } },
      "2": { root: { gridColumn: "span 2" } },
      "3": { root: { gridColumn: "span 3" } },
      "4": { root: { gridColumn: "span 4" } },
      full: { root: { gridColumn: "1 / -1" } }
    })
  }
})
