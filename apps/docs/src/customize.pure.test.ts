import { astryx } from "@acme/theme-astryx"
import { shadcn } from "@acme/theme-shadcn"
import { assert, describe, it } from "@effect/vitest"
import { getControls, getOverrides, getThemeVars } from "./customize.pure.ts"
const themes = [shadcn, astryx]

const initialChoices = { accent: null, neutrals: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

describe("theme builder", () => {
  it("offers each theme's accent as a choice", () => {
    // Arrange
    const accent = getControls({ themes: themes }).find((c) => c.id === "accent")
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
    const vars = getOverrides({ choices: choices, themes: themes, theme: shadcn, mode: "light" })
    // Assert
    assert.strictEqual(vars["--color-accent"], getThemeVars({ theme: astryx, mode: "light" })["--color-accent"])
  })

  it("scales length tokens", () => {
    // Arrange
    const choices = { ...initialChoices, scale: 110 }
    // Act
    const vars = getOverrides({ choices: choices, themes: themes, theme: shadcn, mode: "light" })
    // Assert
    assert.strictEqual(vars["--spacing-4"], "17.6px")
  })
})
