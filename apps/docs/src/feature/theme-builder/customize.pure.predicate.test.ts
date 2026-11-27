import { assert, describe, it } from "@effect/vitest"
import { isCustomized } from "./customize.pure.predicate.ts"
const initialChoices = { custom: false, accent: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

describe("isCustomized", () => {
  it("knows when the custom theme is picked", () => {
    // Arrange
    const choices = [initialChoices, { ...initialChoices, custom: true }]
    // Act
    const customized = choices.map((c) => isCustomized({ choices: c }))
    // Assert
    assert.deepStrictEqual(customized, [false, true])
  })
})
