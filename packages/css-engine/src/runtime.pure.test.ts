import { assert, describe, it } from "@effect/vitest"
import { composeRecipe } from "./runtime.pure.ts"

const card = composeRecipe({
  runtime: {
    base: "base",
    variants: { size: { sm: "sm", lg: "lg" }, wide: { true: "wide", false: "narrow" } },
    defaults: { size: "sm", wide: "false" },
    compound: [{ variants: { size: "lg", wide: "true" }, className: "lg-wide" }]
  }
})

describe("recipe runtime", () => {
  it("applies defaults when a prop is missing", () => {
    // Arrange
    const props = {}
    // Act
    const classes = card(props)
    // Assert
    assert.strictEqual(classes, "base sm narrow")
  })

  it("uses given props, booleans included", () => {
    // Arrange
    const props = { size: "lg", wide: true }
    // Act
    const classes = card(props)
    // Assert
    assert.strictEqual(classes, "base lg wide lg-wide")
  })

  it("ignores undefined props", () => {
    // Arrange
    const props = { size: undefined }
    // Act
    const classes = card(props)
    // Assert
    assert.strictEqual(classes, "base sm narrow")
  })
})
