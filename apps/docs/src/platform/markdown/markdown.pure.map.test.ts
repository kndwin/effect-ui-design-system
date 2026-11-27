import { assert, describe, it } from "@effect/vitest"
import { mapBlockToMarkdown } from "./markdown.pure.map.ts"

describe("mapBlockToMarkdown", () => {
  it("fences code with its language and file name", () => {
    // Arrange
    const block = { _tag: "Code" as const, code: "pnpm dev\n", language: "shell" as const, title: "terminal" }
    // Act
    const markdown = mapBlockToMarkdown({ block })
    // Assert
    assert.strictEqual(markdown, '```bash title="terminal"\npnpm dev\n```')
  })

  it("uses a longer fence when the code has backticks", () => {
    // Arrange
    const block = { _tag: "Code" as const, code: "const a = ```x```" }
    // Act
    const markdown = mapBlockToMarkdown({ block })
    // Assert
    assert.strictEqual(markdown, "````ts\nconst a = ```x```\n````")
  })

  it("quotes a notice", () => {
    // Arrange
    const block = { _tag: "Notice" as const, text: "Not on npm yet." }
    // Act
    const markdown = mapBlockToMarkdown({ block })
    // Assert
    assert.strictEqual(markdown, "> Not on npm yet.")
  })
})
