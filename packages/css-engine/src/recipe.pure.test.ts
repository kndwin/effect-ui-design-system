import { describe, expect, it } from "vitest"
import { compileRecipe } from "./recipe.pure.ts"
import { recipe } from "./runtime.pure.ts"

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
    const { css, runtime } = compileRecipe(source, scope, true)
    // Assert
    expect(css).toEqual([
      `.${runtime.base}{color:red}`,
      `.${runtime.variants.size!.sm}{padding:4px}`,
      `.${runtime.variants.size!.lg}{padding:16px}`,
      `.${runtime.compound[0]!.className}{font-weight:600}`
    ])
  })

  it("produces a runtime the browser recipe understands", () => {
    // Arrange
    const { runtime } = compileRecipe(source, "card.ts", true)
    // Act
    const classes = recipe(runtime)({ size: "lg" }).split(" ")
    // Assert
    expect(classes).toEqual([runtime.base, runtime.variants.size!.lg, runtime.compound[0]!.className])
  })
})
