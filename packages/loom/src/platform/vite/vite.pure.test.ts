import { assert, describe, it } from "@effect/vitest"
import { getEntrySource, getGlobBase, getPageHtml } from "./vite.pure.ts"

describe("getGlobBase", () => {
  it("is the folders before the first wildcard", () => {
    // Arrange
    const glob = "../../packages/components/src/**/*.loom.ts"
    // Act
    const base = getGlobBase({ glob })
    // Assert
    assert.strictEqual(base, "../../packages/components/src")
  })
})

describe("getEntrySource", () => {
  it("imports the config and every loom file, and mounts the viewer", () => {
    // Arrange
    const input = { config: "/app/weft.config.ts", files: ["/app/src/select.loom.ts"] }
    // Act
    const source = getEntrySource(input)
    // Assert
    assert.include(source, 'import config from "/@fs/app/weft.config.ts"')
    assert.include(source, 'import loom0 from "/@fs/app/src/select.loom.ts"')
    assert.include(source, "BrowserHost.mount(App")
  })

  it("starts with no themes when there's no config", () => {
    // Arrange
    const input = { config: null, files: [] }
    // Act
    const source = getEntrySource(input)
    // Assert
    assert.include(source, "const config = { themes: [], loom: {} }")
  })
})

describe("getPageHtml", () => {
  it("loads the entry as a module", () => {
    // Arrange
    const entry = "/@id/__x00__virtual:weft/loom"
    // Act
    const html = getPageHtml({ entry })
    // Assert
    assert.include(html, '<script type="module" src="/@id/__x00__virtual:weft/loom"></script>')
  })
})
