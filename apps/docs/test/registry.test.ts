import { assert, describe, it } from "@effect/vitest"
import { examples } from "../src/registry.constant.ts"

describe("registry", () => {
  it("finds every example file with its source", () => {
    // Arrange
    const pages = new Set(examples.map((e) => e.page))
    // Act
    const withSource = examples.filter((e) => e.source.includes("Html.component("))
    // Assert
    assert.deepStrictEqual([...pages].toSorted(), ["avatar", "button", "code-block", "introduction"])
    assert.strictEqual(withSource.length, examples.length)
  })

  it("orders examples within a page", () => {
    // Arrange
    const button = examples.filter((e) => e.page === "button")
    // Act
    const orders = button.map((e) => e.order)
    // Assert
    assert.deepStrictEqual(
      orders,
      orders.toSorted((a, b) => a - b)
    )
  })
})
