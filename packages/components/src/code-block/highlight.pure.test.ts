import { describe, expect, it } from "vitest"
import { highlight } from "./highlight.pure.ts"

describe("highlight", () => {
  it("splits TypeScript into token kinds without losing text", () => {
    // Arrange
    const code = 'const a = "x" // note'
    // Act
    const tokens = highlight(code, "ts")
    // Assert
    expect(tokens.map(([, text]) => text).join("")).toBe(code)
    expect(tokens.filter(([kind]) => kind !== "plain")).toEqual([
      ["keyword", "const"],
      ["string", '"x"'],
      ["comment", "// note"]
    ])
  })

  it("marks shell commands, flags and comments", () => {
    // Arrange
    const code = "pnpm add --save x # why"
    // Act
    const kinds = highlight(code, "shell").filter(([kind]) => kind !== "plain")
    // Assert
    expect(kinds).toEqual([
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
    expect(tokens).toEqual([["plain", code]])
  })
})
