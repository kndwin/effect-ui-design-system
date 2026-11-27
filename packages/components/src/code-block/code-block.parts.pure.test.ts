import { describe, expect, it } from "vitest"
import { CodeBlockParts } from "./code-block.parts.pure.ts"

describe("code block parts", () => {
  it("styles line marks and token kinds through data attributes", () => {
    // Arrange
    const { line, token } = CodeBlockParts.parts
    // Act
    const marks = Object.keys(line.states)
    // Assert
    expect(marks).toEqual(["added", "removed", "highlighted"])
    expect(token.states.keyword).toBe("[data-token=keyword]")
  })
})
