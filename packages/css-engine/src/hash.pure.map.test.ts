import { assert, describe, it } from "@effect/vitest"
import { mapStringToHash } from "./hash.pure.map.ts"

describe("hash", () => {
  it("is stable and differs by input", () => {
    // Arrange
    const inputs = ["a", "a", "b"]
    // Act
    const [first, again, other] = inputs.map((input) => mapStringToHash({ input }))
    // Assert
    assert.strictEqual(first, again)
    assert.notStrictEqual(first, other)
  })
})
