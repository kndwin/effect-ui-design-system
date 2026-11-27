import { assert, describe, it } from "@effect/vitest"
import { SwatchParts } from "../src/swatch/swatch.parts.constant.ts"

describe("swatch parts", () => {
  it("is a single root named Swatch", () => {
    // Arrange
    const parts = SwatchParts
    // Act
    const shape = [parts.name, Object.keys(parts.parts)]
    // Assert
    assert.deepStrictEqual(shape, ["Swatch", ["root"]])
  })
})
