import { astryx } from "@weft/theme-astryx"
import { shadcn } from "@weft/theme-shadcn"
import { assert, describe, it } from "@effect/vitest"
import { getThemeVars } from "../../platform/theme/theme.pure.ts"
import { getControls, getOverrides } from "./customize.pure.ts"
const themes = [shadcn, astryx]

const initialChoices = { custom: false, accent: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

describe("theme builder", () => {
  it("names options by what they are, not by the theme they come from", () => {
    // Arrange
    const controls = getControls({ themes, theme: shadcn })
    // Act
    const labels = controls.flatMap((c) => c.options.map((o) => o.label))
    // Assert
    assert.notInclude(labels, "shadcn")
    assert.notInclude(labels, "astryx")
    assert.includeMembers(labels, ["blue", "Small", "Medium", "Compact", "Regular", "Geist", "Figtree"])
  })

  it("takes the accent hue from the base theme", () => {
    // Arrange
    const choices = { ...initialChoices, custom: true, accent: "blue" }
    // Act
    const vars = getOverrides({ choices, themes, theme: astryx, mode: "light" })
    // Assert
    assert.strictEqual(vars["--color-accent"], getThemeVars({ theme: astryx, mode: "light" })["--hue-blue"])
  })

  it("scales length tokens", () => {
    // Arrange
    const choices = { ...initialChoices, custom: true, scale: 110 }
    // Act
    const vars = getOverrides({ choices, themes, theme: shadcn, mode: "light" })
    // Assert
    assert.strictEqual(vars["--spacing-4"], "17.6px")
  })

  it("overrides nothing until the custom theme is picked", () => {
    // Arrange
    const choices = { ...initialChoices, accent: "blue" }
    // Act
    const vars = getOverrides({ choices, themes, theme: shadcn, mode: "light" })
    // Assert
    assert.deepStrictEqual(vars, {})
  })
})
