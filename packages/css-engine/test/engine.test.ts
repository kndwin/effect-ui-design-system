import { describe, expect, it } from "vitest"
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
    expect(card.name).toBe("Card")
    expect(sm).toMatch(/Card_root.* .*size_sm/)
    expect(lg).toMatch(/size_lg/)
    expect(lg).not.toMatch(/size_sm/)
  })

  it("leaves exports the adapter ignores alone", () => {
    // Arrange
    const value = untouched
    // Act
    const passedThrough = value === 42
    // Assert
    expect(passedThrough).toBe(true)
  })
})
