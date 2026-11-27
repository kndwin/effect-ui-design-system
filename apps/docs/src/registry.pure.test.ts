import { describe, expect, it } from "vitest"
import { examples } from "./registry.pure.ts"

describe("registry", () => {
  it("finds every example file with its source", () => {
    // Arrange
    const pages = new Set(examples.map((e) => e.page))
    // Act
    const withSource = examples.filter((e) => e.source.includes("Html.component("))
    // Assert
    expect([...pages].toSorted()).toEqual(["avatar", "button", "code-block", "introduction"])
    expect(withSource.length).toBe(examples.length)
  })

  it("orders examples within a page", () => {
    // Arrange
    const button = examples.filter((e) => e.page === "button")
    // Act
    const orders = button.map((e) => e.order)
    // Assert
    expect(orders).toEqual(orders.toSorted((a, b) => a - b))
  })
})
