import { describe, expect, it } from "vitest"
import { pages, sources } from "./content.pure.ts"

describe("content", () => {
  it("groups pages into the sidebar's sections, in order", () => {
    // Arrange
    const sections = pages.map((p) => p.section)
    // Act
    const order = [...new Set(sections)]
    // Assert
    expect(order).toEqual(["Getting started", "Components", "Foundations"])
  })

  it("shows real source files", () => {
    // Arrange
    const contract = sources.contract
    // Act
    const declaresColors = contract.includes('TokenColor.make("color"')
    // Assert
    expect(declaresColors).toBe(true)
    expect(sources.themes.shadcn).toContain("Theme.make(Tokens")
  })

  it("gives every component page its style source", () => {
    // Arrange
    const components = pages.filter((p) => p.section === "Components")
    // Act
    const withStyles = components.filter((p) => p.style?.includes("Style.make("))
    // Assert
    expect(withStyles.length).toBe(components.length)
  })
})
