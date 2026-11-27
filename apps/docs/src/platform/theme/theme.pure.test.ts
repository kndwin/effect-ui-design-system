import { assert, describe, it } from "@effect/vitest"
import { astryx } from "@acme/theme-astryx"
import { getTheme, getThemeVars } from "./theme.pure.ts"

describe("theme", () => {
  it("layers a mode's variables over the base", () => {
    // Arrange
    const theme = astryx
    // Act
    const light = getThemeVars({ theme, mode: "light" })
    const dark = getThemeVars({ theme, mode: "dark" })
    // Assert
    assert.notStrictEqual(light["--color-surface"], dark["--color-surface"])
    assert.strictEqual(light["--radius-control"], dark["--radius-control"])
  })

  it("finds a theme by name, falling back to the first", () => {
    // Arrange
    const names = ["astryx", "nope"]
    // Act
    const found = names.map((name) => getTheme({ name }).name)
    // Assert
    assert.deepStrictEqual(found, ["astryx", "shadcn"])
  })
})
