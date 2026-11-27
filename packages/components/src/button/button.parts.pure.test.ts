import { describe, expect, it } from "vitest"
import { ButtonParts } from "./button.parts.pure.ts"

describe("button parts", () => {
  it("maps ui-kit's attributes to states on root", () => {
    // Arrange
    const root = ButtonParts.parts.root
    // Act
    const states = root.states
    // Assert
    expect(states).toEqual({ disabled: "[data-disabled]", busy: "[aria-busy=true]", pressed: "[aria-pressed=true]" })
  })
})
