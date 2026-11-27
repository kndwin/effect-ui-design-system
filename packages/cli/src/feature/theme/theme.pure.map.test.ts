import { assert, describe, it } from "@effect/vitest"
import { mapNameToIdentifier, mapThemeToRecipeSource } from "./theme.pure.map.ts"

const source = [
  'import { Tokens } from "@weft/components/tokens"',
  'import * as Theme from "@weft/design-system/Theme"',
  "",
  "export const astryx = Theme.make(Tokens, {",
  '  name: "astryx",',
  "  values: {}",
  "})"
].join("\n")

describe("mapNameToIdentifier", () => {
  it("turns a kebab-case name into camelCase", () => {
    // Arrange
    const name = "acme-dark"
    // Act
    const identifier = mapNameToIdentifier({ name })
    // Assert
    assert.strictEqual(identifier, "acmeDark")
  })
})

describe("mapThemeToRecipeSource", () => {
  it("renames the theme, imports your contract and makes it the default", () => {
    // Arrange
    const input = { source, base: "astryx", name: "brand", tokensImport: "./components/ui/tokens.ts" }
    // Act
    const recipe = mapThemeToRecipeSource(input)
    // Assert
    assert.strictEqual(
      recipe,
      [
        'import { Tokens } from "./components/ui/tokens.ts"',
        'import * as Theme from "@weft/design-system/Theme"',
        "",
        "export const brand = Theme.make(Tokens, {",
        '  name: "brand",',
        "  default: true,",
        "  values: {}",
        "})"
      ].join("\n")
    )
  })

  it("keeps a single default", () => {
    // Arrange
    const input = {
      source: source.replace('name: "astryx",', 'name: "astryx",\n  default: true,'),
      base: "astryx",
      name: "brand",
      tokensImport: "./tokens.ts"
    }
    // Act
    const recipe = mapThemeToRecipeSource(input)
    // Assert
    assert.strictEqual(recipe.split("default: true").length, 2)
  })
})
