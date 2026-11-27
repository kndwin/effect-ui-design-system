import { assert, describe, it } from "@effect/vitest"
import { isAdapter } from "./rules.pure.predicate.ts"

describe("isAdapter", () => {
  it("accepts a compile function and rejects anything else", () => {
    // Arrange
    const candidates = [() => undefined, "compile", undefined]
    // Act
    const results = candidates.map((value) => isAdapter({ value }))
    // Assert
    assert.deepStrictEqual(results, [true, false, false])
  })
})
