import { assert, describe, it } from "@effect/vitest"
import { Card, untouched } from "./fixtures/card.style.fixture.ts"

type Compiled = { readonly name: string; readonly classes: { readonly root: (p?: object) => string } }

describe("css-engine", () => {
  it("compiles an export through the adapter into class functions", () => {
    // Arrange
    const card = Card as unknown as Compiled
    // Act
    const sm = card.classes.root()
    const lg = card.classes.root({ size: "lg" })
    // Assert
    assert.strictEqual(card.name, "Card")
    assert.match(sm, /Card_root.* .*size_sm/)
    assert.match(lg, /size_lg/)
    assert.notMatch(lg, /size_sm/)
  })

  it("leaves exports the adapter ignores alone", () => {
    // Arrange
    const value = untouched
    // Act
    const passedThrough = value === 42
    // Assert
    assert.strictEqual(passedThrough, true)
  })
})
