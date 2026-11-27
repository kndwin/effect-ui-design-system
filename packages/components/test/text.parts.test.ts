import { assert, describe, it } from "@effect/vitest"
import { TextParts } from "../src/text/text.parts.constant.ts"

describe("text parts", () => {
  it("is a single root named Text", () => {
    // Arrange
    const parts = TextParts
    // Act
    const shape = [parts.name, Object.keys(parts.parts)]
    // Assert
    assert.deepStrictEqual(shape, ["Text", ["root"]])
  })
})
