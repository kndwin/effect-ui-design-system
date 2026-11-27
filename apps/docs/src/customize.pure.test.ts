import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { assert, describe, it } from "@effect/vitest"
import { initialChoices } from "./customize.constant.ts"
import { controls, isCustomized, overrides, varsOf } from "./customize.pure.ts"

const themes = [shadcn, astryx]

describe("theme builder", () => {
  it("offers each theme's accent as a choice", () => {
    // Arrange
    const accent = controls(themes).find((c) => c.id === "accent")
    // Act
    const ids = accent?.options.map((o) => o.id) ?? []
    // Assert
    assert.include(ids, "shadcn:accent")
    assert.include(ids, "astryx:accent")
  })

  it("overrides the accent tokens with the chosen theme's values", () => {
    // Arrange
    const choices = { ...initialChoices, accent: "astryx:accent" }
    // Act
    const vars = overrides(choices, themes, shadcn, "light")
    // Assert
    assert.strictEqual(vars["--color-accent"], varsOf(astryx, "light")["--color-accent"])
  })

  it("scales length tokens", () => {
    // Arrange
    const choices = { ...initialChoices, scale: 110 }
    // Act
    const vars = overrides(choices, themes, shadcn, "light")
    // Assert
    assert.strictEqual(vars["--spacing-4"], "17.6px")
  })

  it("knows when nothing is customized", () => {
    // Arrange
    const choices = initialChoices
    // Act
    const customized = isCustomized(choices)
    // Assert
    assert.strictEqual(customized, false)
  })
})
