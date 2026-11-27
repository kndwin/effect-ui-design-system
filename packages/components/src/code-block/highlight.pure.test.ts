import { assert, describe, it } from "@effect/vitest"
import { highlight } from "./highlight.pure.ts"

describe("highlight", () => {
  it("splits TypeScript into token kinds without losing text", () => {
    // Arrange
    const code = 'const a = "x" // note'
    // Act
    const tokens = highlight(code, "ts")
    // Assert
    assert.strictEqual(tokens.map(([, text]) => text).join(""), code)
    assert.deepStrictEqual(
      tokens.filter(([kind]) => kind !== "plain"),
      [
        ["keyword", "const"],
        ["string", '"x"'],
        ["comment", "// note"]
      ]
    )
  })

  it("marks shell commands, flags and comments", () => {
    // Arrange
    const code = "pnpm add --save x # why"
    // Act
    const kinds = highlight(code, "shell").filter(([kind]) => kind !== "plain")
    // Assert
    assert.deepStrictEqual(kinds, [
      ["keyword", "pnpm"],
      ["number", " --save"],
      ["comment", "# why"]
    ])
  })

  it("leaves plain text alone", () => {
    // Arrange
    const code = "const x = 1"
    // Act
    const tokens = highlight(code, "plain")
    // Assert
    assert.deepStrictEqual(tokens, [["plain", code]])
  })
})
