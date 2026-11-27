import { assert, describe, it } from "@effect/vitest"
import * as TokenColor from "./token-color.make.ts"
import { getCssVarName } from "./token.pure.ts"

describe("token groups", () => {
  it("names CSS variables after prefix and key, with dots made safe", () => {
    // Arrange
    const keys = ["accent", "1.5"]
    // Act
    const names = keys.map((key) => getCssVarName({ prefix: "spacing", key }))
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
    assert.strictEqual(Colors["~acme/ds/TokenGroup"].kind, "Color")
    assert.deepStrictEqual(Colors["~acme/ds/TokenGroup"].keys, ["surface", "accent"])
  })
})
