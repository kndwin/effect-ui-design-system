import { assert, describe, it } from "@effect/vitest"
import { isStyleDefinition } from "./style.pure.predicate.ts"

describe("isStyleDefinition", () => {
  it("is true only for an uncompiled Style.make definition", () => {
    // Arrange
    const values = [{ "~acme": "Style" }, { "~acme": "Theme" }, null, "Style"]
    // Act
    const results = values.map((value) => isStyleDefinition({ value }))
    // Assert
    assert.deepStrictEqual(results, [true, false, false, false])
  })
})
