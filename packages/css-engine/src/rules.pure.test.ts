import { describe, expect, it } from "vitest"
import { isAdapter } from "./rules.pure.ts"

describe("isAdapter", () => {
  it("accepts a compile function and rejects anything else", () => {
    // Arrange
    const candidates = [() => undefined, "compile", undefined]
    // Act
    const results = candidates.map(isAdapter)
    // Assert
    expect(results).toEqual([true, false, false])
  })
})
