import { describe, expect, it } from "vitest"
import { SwatchParts } from "./swatch.parts.pure.ts"

describe("swatch parts", () => {
  it("is a single root named Swatch", () => {
    // Arrange
    const parts = SwatchParts
    // Act
    const shape = [parts.name, Object.keys(parts.parts)]
    // Assert
    expect(shape).toEqual(["Swatch", ["root"]])
  })
})
