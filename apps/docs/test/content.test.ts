import { assert, describe, it } from "@effect/vitest"
import { pages, sources } from "../src/content.constant.ts"

describe("content", () => {
  it("groups pages into the sidebar's sections, in order", () => {
    // Arrange
    const sections = pages.map((p) => p.section)
    // Act
    const order = [...new Set(sections)]
    // Assert
    assert.deepStrictEqual(order, ["Getting started", "Components", "Foundations"])
  })

  it("shows real source files", () => {
    // Arrange
    const contract = sources.contract
    // Act
    const declaresColors = contract.includes('TokenColor.make("color"')
    // Assert
    assert.strictEqual(declaresColors, true)
    assert.include(sources.themes.shadcn, "Theme.make(Tokens")
  })

  it("gives every component page its style source", () => {
    // Arrange
    const components = pages.filter((p) => p.section === "Components")
    // Act
    const withStyles = components.filter((p) => p.style?.includes("Style.make("))
    // Assert
    assert.strictEqual(withStyles.length, components.length)
  })
})
