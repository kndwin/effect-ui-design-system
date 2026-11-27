import { assert, describe, it } from "@effect/vitest"
import { isAdapter } from "./rules.pure.ts"

describe("isAdapter", () => {
  it("accepts a compile function and rejects anything else", () => {
    // Arrange
    const candidates = [() => undefined, "compile", undefined]
    // Act
    const results = candidates.map(isAdapter)
    // Assert
    assert.deepStrictEqual(results, [true, false, false])
  })
})
