import { assert, describe, it } from "@effect/vitest"
import * as TokenColor from "./token-color.make.ts"
import { GroupTypeId } from "./token.constant.ts"
import { cssVarName } from "./token.pure.ts"

describe("token groups", () => {
  it("names CSS variables after prefix and key, with dots made safe", () => {
    // Arrange
    const keys = ["accent", "1.5"]
    // Act
    const names = keys.map((k) => cssVarName("spacing", k))
    // Assert
    assert.deepStrictEqual(names, ["--spacing-accent", "--spacing-1_5"])
  })

  it("gives each key a var() reference and keeps the group's metadata", () => {
    // Arrange
    const keys = ["surface", "accent"] as const
    // Act
    const Colors = TokenColor.make("color", keys)
    // Assert
    assert.strictEqual(Colors.accent, "var(--color-accent)")
    assert.strictEqual(Colors[GroupTypeId].kind, "Color")
    assert.deepStrictEqual(Colors[GroupTypeId].keys, ["surface", "accent"])
  })
})
