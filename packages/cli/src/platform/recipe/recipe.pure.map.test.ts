import { assert, describe, it } from "@effect/vitest"
import { mapPathToRecipeFile, mapSourceToImports, mapSourceToRecipeSource } from "./recipe.pure.map.ts"

describe("mapPathToRecipeFile", () => {
  it("drops .component and names the contract and scales", () => {
    // Arrange
    const paths = [
      "src/platform/button/button.component.ts",
      "src/platform/button/button.component.style.ts",
      "src/platform/token/contract.token.ts",
      "src/platform/scale/scales.schema.ts"
    ]
    // Act
    const files = paths.map((path) => mapPathToRecipeFile({ path }))
    // Assert
    assert.deepStrictEqual(files, ["button.ts", "button.component.style.ts", "tokens.ts", "scales.ts"])
  })
})

describe("mapSourceToImports", () => {
  it("resolves relative imports and skips packages", () => {
    // Arrange
    const source = [
      'import { Style } from "@weft/design-system/Style"',
      'import { ButtonStyle } from "./button.component.style.ts"',
      'import { Colors } from "../../platform/token/contract.token.ts"'
    ].join("\n")
    // Act
    const imports = mapSourceToImports({ path: "src/feature/dialog/dialog.component.ts", source })
    // Assert
    assert.deepStrictEqual(imports, [
      "src/feature/dialog/button.component.style.ts",
      "src/platform/token/contract.token.ts"
    ])
  })
})

describe("mapSourceToRecipeSource", () => {
  it("points relative imports at the flat copies", () => {
    // Arrange
    const source = [
      'import { Style } from "@weft/design-system/Style"',
      'import { Button } from "../../platform/button/button.component.ts"',
      'import { Colors } from "../../platform/token/contract.token.ts"'
    ].join("\n")
    // Act
    const recipe = mapSourceToRecipeSource({ path: "src/feature/dialog/dialog.component.ts", source })
    // Assert
    assert.strictEqual(
      recipe,
      [
        'import { Style } from "@weft/design-system/Style"',
        'import { Button } from "./button.ts"',
        'import { Colors } from "./tokens.ts"'
      ].join("\n")
    )
  })
})
