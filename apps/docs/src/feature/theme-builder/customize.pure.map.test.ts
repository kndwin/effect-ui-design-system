import { assert, describe, it } from "@effect/vitest"
import { mapVarsToInlineStyle } from "./customize.pure.map.ts"

describe("mapVarsToInlineStyle", () => {
  it("writes variables as an inline style", () => {
    // Arrange
    const vars = { "--color-accent": "#000", "--radius-control": "8px" }
    // Act
    const style = mapVarsToInlineStyle({ vars })
    // Assert
    assert.strictEqual(style, "--color-accent:#000;--radius-control:8px")
  })
})
