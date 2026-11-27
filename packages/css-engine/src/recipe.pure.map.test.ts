import { assert, describe, it } from "@effect/vitest"
import { mapRecipeToCompiledRecipe } from "./recipe.pure.map.ts"
import { composeRecipe } from "./runtime.pure.ts"

const source = {
  kind: "recipe",
  debugId: "Card_root",
  base: { color: "red" },
  variants: { size: { sm: { padding: 4 }, lg: { padding: 16 } } },
  defaultVariants: { size: "sm" },
  compoundVariants: [{ variants: { size: "lg" }, style: { fontWeight: 600 } }]
} as const

describe("compileRecipe", () => {
  it("emits one rule per class", () => {
    // Arrange
    const scope = "card.ts"
    // Act
    const { css, runtime } = mapRecipeToCompiledRecipe({ recipe: source, scope: scope, debug: true })
    // Assert
    assert.deepStrictEqual(css, [
      `.${runtime.base}{color:red}`,
      `.${runtime.variants.size!.sm}{padding:4px}`,
      `.${runtime.variants.size!.lg}{padding:16px}`,
      `.${runtime.compound[0]!.className}{font-weight:600}`
    ])
  })

  it("produces a runtime the browser recipe understands", () => {
    // Arrange
    const { runtime } = mapRecipeToCompiledRecipe({ recipe: source, scope: "card.ts", debug: true })
    // Act
    const classes = composeRecipe({ runtime })({ size: "lg" }).split(" ")
    // Assert
    assert.deepStrictEqual(classes, [runtime.base, runtime.variants.size!.lg, runtime.compound[0]!.className])
  })
})
