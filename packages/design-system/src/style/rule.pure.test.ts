import { describe, expect, it } from "vitest"
import { breakpoints } from "./rule.pure.ts"

describe("breakpoints", () => {
  it("defines narrow as a media query", () => {
    // Arrange
    const name = "narrow"
    // Act
    const query = breakpoints[name]
    // Assert
    expect(query).toMatch(/^screen and \(max-width: \d+px\)$/)
  })
})
