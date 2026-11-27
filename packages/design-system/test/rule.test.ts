import { assert, describe, it } from "@effect/vitest"
import { breakpoints } from "../src/style/rule.constant.ts"

describe("breakpoints", () => {
  it("defines narrow as a media query", () => {
    // Arrange
    const name = "narrow"
    // Act
    const query = breakpoints[name]
    // Assert
    assert.match(query, /^screen and \(max-width: \d+px\)$/)
  })
})
