import { assert, describe, it } from "@effect/vitest"
import { getLlmsIndex, getMarkdownPath, getPageMarkdown } from "./markdown.pure.ts"

const button = {
  id: "button",
  section: "Components" as const,
  title: "Button",
  lead: "A native button.",
  style: 'import { Colors } from "../token/contract.token.ts"',
  styleFile: "packages/components/src/platform/button/button.component.style.ts"
}

const introduction = { id: "introduction", section: "Getting started" as const, title: "Introduction", lead: "Hi." }

describe("getMarkdownPath", () => {
  it("adds .md to the page's address, and calls the home page index.md", () => {
    // Arrange
    const pages = [button, introduction]
    // Act
    const paths = pages.map((page) => getMarkdownPath({ page }))
    // Assert
    assert.deepStrictEqual(paths, ["/components/button.md", "/index.md"])
  })
})

describe("getPageMarkdown", () => {
  it("writes a component's examples and how to install it", () => {
    // Arrange
    const page = button
    // Act
    const markdown = getPageMarkdown({ page })
    // Assert
    assert.isTrue(markdown.startsWith("# Button\n\nA native button.\n\n## Examples"))
    assert.include(markdown, 'from "@/components/ui/button"')
    assert.include(markdown, "## Installation\n\n")
    assert.include(markdown, "```bash\npnpm weft add button\n```")
    assert.include(markdown, 'import { Colors } from "./tokens.ts"')
  })
})

describe("getLlmsIndex", () => {
  it("lists each page under its section with a link to its Markdown", () => {
    // Arrange
    const pages = [introduction, button]
    // Act
    const index = getLlmsIndex({ pages })
    // Assert
    assert.include(index, "## Getting started\n- [Introduction](https://weft-docs.kndwin.workers.dev/index.md): Hi.")
    assert.include(index, "## Components\n- [Button](https://weft-docs.kndwin.workers.dev/components/button.md)")
  })
})
