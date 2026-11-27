import * as Style from "@acme/design-system/Style"
import * as Variant from "@acme/design-system/Variant"
import { StackParts, StackItemParts } from "./layout.parts.constant.ts"
import { AlignSchema, DirectionSchema, JustifySchema, SpaceSchema } from "../../platform/scale/scales.schema.ts"
import { composeSpaceVariants } from "./space.pure.ts"

export const StackStyle = Style.make(StackParts)({
  base: { root: { display: "flex", minWidth: 0 } },
  variants: {
    direction: Variant.make(
      DirectionSchema,
      { row: { root: { flexDirection: "row" } }, column: { root: { flexDirection: "column" } } },
      { default: "column" }
    ),
    gap: Variant.make(SpaceSchema, composeSpaceVariants({ property: "gap" }), { default: "0" }),
    align: Variant.make(AlignSchema, {
      start: { root: { alignItems: "flex-start" } },
      center: { root: { alignItems: "center" } },
      end: { root: { alignItems: "flex-end" } },
      stretch: { root: { alignItems: "stretch" } },
      baseline: { root: { alignItems: "baseline" } }
    }),
    justify: Variant.make(JustifySchema, {
      start: { root: { justifyContent: "flex-start" } },
      center: { root: { justifyContent: "center" } },
      end: { root: { justifyContent: "flex-end" } },
      between: { root: { justifyContent: "space-between" } }
    }),
    wrap: Variant.makeFlag({ root: { flexWrap: "wrap" } })
  }
})

export const StackItemStyle = Style.make(StackItemParts)({
  base: { root: { minWidth: 0 } },
  variants: {
    grow: Variant.makeFlag({ root: { flexGrow: 1 } }),
    fixed: Variant.makeFlag({ root: { flexShrink: 0 } }),
    fill: Variant.makeFlag({ root: { width: "100%" } })
  }
})
