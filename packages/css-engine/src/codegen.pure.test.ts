import { assert, describe, it } from "@effect/vitest"
import { moduleSource } from "./codegen.pure.ts"

const imports = { css: "/x.ts.acme.css", runtime: "/runtime.pure.ts" }
const runtime = { base: "b", variants: {}, defaults: {}, compound: [] }

describe("moduleSource", () => {
  it("imports the sheet and the runtime first", () => {
    // Arrange
    const exports: ReadonlyArray<never> = []
    // Act
    const [css, rt] = moduleSource(exports, imports).split("\n")
    // Assert
    assert.strictEqual(css, 'import "/x.ts.acme.css"')
    assert.strictEqual(rt, 'import { recipe as __recipe } from "/runtime.pure.ts"')
  })

  it("passes plain values through as JSON", () => {
    // Arrange
    const exports = [{ name: "answer", value: { n: 42 } }]
    // Act
    const source = moduleSource(exports, imports)
    // Assert
    assert.include(source, 'export const answer = {"n":42}')
  })

  it("places compiled recipes under recipesAt", () => {
    // Arrange
    const exports = [{ name: "Card", runtime: { kit: "Card" }, recipesAt: "slots", recipes: { root: runtime } }]
    // Act
    const source = moduleSource(exports, imports)
    // Assert
    assert.include(source, 'export const Card = { ...{"kit":"Card"}, "slots": {"root": __recipe(')
  })
})
