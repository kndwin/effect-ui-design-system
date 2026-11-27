import { assert, describe, it } from "@effect/vitest"
import { CodeBlockParts } from "../src/code-block/code-block.parts.constant.ts"

describe("code block parts", () => {
  it("styles line marks and token kinds through data attributes", () => {
    // Arrange
    const { line, token } = CodeBlockParts.parts
    // Act
    const marks = Object.keys(line.states)
    // Assert
    assert.deepStrictEqual(marks, ["added", "removed", "highlighted"])
    assert.strictEqual(token.states.keyword, "[data-token=keyword]")
  })
})
