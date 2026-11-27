import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { describe, expect, it } from "vitest"
import { controls, initialChoices, isCustomized, overrides, themeSource, varsOf } from "./customize.pure.ts"

const themes = [shadcn, astryx]

describe("theme builder", () => {
  it("offers each theme's accent as a choice", () => {
    // Arrange
    const accent = controls(themes).find((c) => c.id === "accent")
    // Act
    const ids = accent?.options.map((o) => o.id) ?? []
    // Assert
    expect(ids).toContain("shadcn:accent")
    expect(ids).toContain("astryx:accent")
  })

  it("overrides the accent tokens with the chosen theme's values", () => {
    // Arrange
    const choices = { ...initialChoices, accent: "astryx:accent" }
    // Act
    const vars = overrides(choices, themes, shadcn, "light")
    // Assert
    expect(vars["--color-accent"]).toBe(varsOf(astryx, "light")["--color-accent"])
  })

  it("scales length tokens", () => {
    // Arrange
    const choices = { ...initialChoices, scale: 110 }
    // Act
    const vars = overrides(choices, themes, shadcn, "light")
    // Assert
    expect(vars["--spacing-4"]).toBe("17.6px")
  })

  it("knows when nothing is customized", () => {
    // Arrange
    const choices = initialChoices
    // Act
    const customized = isCustomized(choices)
    // Assert
    expect(customized).toBe(false)
  })

  it("exports a Theme.make file", () => {
    // Arrange
    const choices = { ...initialChoices, radius: "none" }
    // Act
    const source = themeSource(choices, themes, shadcn)
    // Assert
    expect(source).toContain("Theme.make(Tokens, {")
    expect(source).toContain("control: 0")
  })
})
