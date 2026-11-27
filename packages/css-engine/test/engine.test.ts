// The engine on its own: a fixture module + a fixture adapter, no design system involved.
import { describe, expect, it } from "vitest"
import { Card, untouched } from "./fixtures/card.style.fixture.ts"

type Compiled = { readonly name: string; readonly classes: { readonly root: (p?: object) => string } }

describe("css-engine", () => {
  it("compiles an export through the adapter into class functions", () => {
    const card = Card as unknown as Compiled
    expect(card.name).toBe("Card")
    const sm = card.classes.root()
    const lg = card.classes.root({ size: "lg" })
    expect(sm).toMatch(/Card_root/)
    expect(sm).toMatch(/size_sm/)
    expect(lg).toMatch(/size_lg/)
    expect(lg).not.toMatch(/size_sm/)
  })

  it("leaves exports the adapter ignores alone", () => {
    expect(untouched).toBe(42)
  })
})
