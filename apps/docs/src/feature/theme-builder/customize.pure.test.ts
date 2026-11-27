import { assert, describe, it } from "@effect/vitest"
import { getCustomThemeCommand } from "./customize.pure.ts"

const choices = { custom: true, accent: null, radius: null, sizing: null, font: null, mono: null, scale: 100 }

describe("getCustomThemeCommand", () => {
  it("passes the choices to weft theme", () => {
    // Arrange
    const input = { theme: "astryx", choices: { ...choices, accent: "rose", scale: 90 } }
    // Act
    const command = getCustomThemeCommand(input)
    // Assert
    assert.strictEqual(command, 'pnpm weft theme astryx --name custom --choices "accent=rose,scale=90"')
  })

  it("leaves out --choices when nothing is chosen", () => {
    // Arrange
    const input = { theme: "shadcn", choices }
    // Act
    const command = getCustomThemeCommand(input)
    // Assert
    assert.strictEqual(command, "pnpm weft theme shadcn --name custom")
  })
})
