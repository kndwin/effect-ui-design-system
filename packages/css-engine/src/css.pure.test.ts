import { describe, expect, it } from "vitest"
import { declarations, globalRules, property, rules, value } from "./css.pure.ts"

describe("css", () => {
  it("kebab-cases properties and keeps custom properties", () => {
    // Arrange
    const names = ["backgroundColor", "WebkitAppearance", "--color-accent"]
    // Act
    const css = names.map(property)
    // Assert
    expect(css).toEqual(["background-color", "-webkit-appearance", "--color-accent"])
  })

  it("adds px to numbers except unitless properties and zero", () => {
    // Arrange
    const inputs = [
      ["padding", 4],
      ["opacity", 0.5],
      ["margin", 0],
      ["lineHeight", 1.6]
    ] as const
    // Act
    const out = inputs.map(([name, v]) => value(name, v))
    // Assert
    expect(out).toEqual(["4px", "0.5", "0", "1.6"])
  })

  it("writes vars first, then declarations, skipping nested keys", () => {
    // Arrange
    const style = { vars: { "--x": "1" }, color: "red", selectors: { "&:hover": { color: "blue" } } }
    // Act
    const text = declarations(style)
    // Assert
    expect(text).toBe("--x:1;color:red")
  })

  it("expands & selectors and media queries", () => {
    // Arrange
    const style = {
      display: "flex",
      selectors: { "&:hover": { opacity: 0.5 } },
      "@media": { "screen and (max-width: 860px)": { display: "block" } }
    }
    // Act
    const css = rules(".a", style)
    // Assert
    expect(css).toEqual([
      ".a{display:flex}",
      ".a:hover{opacity:0.5}",
      "@media screen and (max-width: 860px){.a{display:block}}"
    ])
  })

  it("writes a global rule's variables on its selector", () => {
    // Arrange
    const rule = { kind: "global", selector: ":root", vars: { "--color-accent": "#000" } } as const
    // Act
    const css = globalRules(rule)
    // Assert
    expect(css).toEqual([":root{--color-accent:#000}"])
  })
})
