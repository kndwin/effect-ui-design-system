import * as Style from "@acme/ds/Style"
import * as Variant from "@acme/ds/Variant"
import { Stack, StackItem } from "@acme/ds/kit/layout"
import { Align, Direction, Justify, Space } from "../scales.pure.ts"
import { space } from "./space.pure.ts"

export const StackStyle = Style.make(Stack)({
  base: { root: { display: "flex", minWidth: 0 } },
  variants: {
    direction: Variant.make(
      Direction,
      { row: { root: { flexDirection: "row" } }, column: { root: { flexDirection: "column" } } },
      { default: "column" }
    ),
    gap: Variant.make(
      Space,
      space((gap) => ({ gap })),
      { default: "0" }
    ),
    align: Variant.make(Align, {
      start: { root: { alignItems: "flex-start" } },
      center: { root: { alignItems: "center" } },
      end: { root: { alignItems: "flex-end" } },
      stretch: { root: { alignItems: "stretch" } },
      baseline: { root: { alignItems: "baseline" } }
    }),
    justify: Variant.make(Justify, {
      start: { root: { justifyContent: "flex-start" } },
      center: { root: { justifyContent: "center" } },
      end: { root: { justifyContent: "flex-end" } },
      between: { root: { justifyContent: "space-between" } }
    }),
    wrap: Variant.flag({ root: { flexWrap: "wrap" } })
  }
})

export const StackItemStyle = Style.make(StackItem)({
  base: { root: { minWidth: 0 } },
  variants: {
    grow: Variant.flag({ root: { flexGrow: 1 } }),
    fixed: Variant.flag({ root: { flexShrink: 0 } }),
    fill: Variant.flag({ root: { width: "100%" } })
  }
})
