import { assert, describe, it } from "@effect/vitest"
import { mapSlotRuleToSelectors } from "./style.pure.map.ts"

describe("mapSlotRuleToSelectors", () => {
  it("splits a slot rule into declarations, & selectors and media queries", () => {
    // Arrange
    const rule = {
      color: "red",
      states: { open: { opacity: 1 }, hover: { opacity: 0.5 } },
      media: { narrow: { color: "blue" } }
    }
    // Act
    const { decl, selectors, media } = mapSlotRuleToSelectors({ rule, partStates: { open: "[data-open]" } })
    // Assert
    assert.deepStrictEqual(decl, { color: "red" })
    assert.deepStrictEqual(Object.keys(selectors), ["&[data-open]", "&:hover"])
    assert.deepStrictEqual(Object.keys(media), ["screen and (max-width: 860px)"])
  })
})
