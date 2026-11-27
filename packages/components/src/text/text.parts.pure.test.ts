import { describe, expect, it } from "vitest"
import { TextParts } from "./text.parts.pure.ts"

describe("text parts", () => {
  it("is a single root named Text", () => {
    // Arrange
    const parts = TextParts
    // Act
    const shape = [parts.name, Object.keys(parts.parts)]
    // Assert
    expect(shape).toEqual(["Text", ["root"]])
  })
})
