import { assert, describe, it } from "@effect/vitest"
import { ButtonParts } from "../src/button/button.parts.constant.ts"

describe("button parts", () => {
  it("maps ui-kit's attributes to states on root", () => {
    // Arrange
    const root = ButtonParts.parts.root
    // Act
    const states = root.states
    // Assert
    assert.deepStrictEqual(states, {
      disabled: "[data-disabled]",
      busy: "[aria-busy=true]",
      pressed: "[aria-pressed=true]"
    })
  })
})
