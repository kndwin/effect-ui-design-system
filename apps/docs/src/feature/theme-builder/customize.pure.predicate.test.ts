import { assert, describe, it } from "@effect/vitest"
import { isCustomized } from "./customize.pure.predicate.ts"
const initialChoices = { accent: null, neutrals: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

describe("isCustomized", () => {
  it("knows when nothing is customized", () => {
    // Arrange
    const choices = initialChoices
    // Act
    const customized = isCustomized({ choices: choices })
    // Assert
    assert.strictEqual(customized, false)
  })
})
