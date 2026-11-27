import { assert, describe, it } from "@effect/vitest"
import { mapArgumentToChoices, mapChoicesToArgument } from "./customize.pure.map.ts"

describe("mapChoicesToArgument", () => {
  it("writes only what was chosen", () => {
    // Arrange
    const choices = {
      custom: true,
      accent: "blue",
      radius: null,
      sizing: null,
      font: "font-Geist",
      mono: null,
      scale: 110
    }
    // Act
    const argument = mapChoicesToArgument({ choices })
    // Assert
    assert.strictEqual(argument, "accent=blue,font=font-Geist,scale=110")
  })
})

describe("mapArgumentToChoices", () => {
  it("reads an argument back into choices", () => {
    // Arrange
    const argument = "accent=blue, font=font-Geist Mono,scale=90,nope=1"
    // Act
    const choices = mapArgumentToChoices({ argument })
    // Assert
    assert.deepStrictEqual(choices, {
      custom: true,
      accent: "blue",
      radius: null,
      sizing: null,
      font: "font-Geist Mono",
      mono: null,
      scale: 90
    })
  })
})
