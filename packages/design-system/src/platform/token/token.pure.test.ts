import { assert, describe, it } from "@effect/vitest"
import * as TokenColor from "./token-color.make.ts"
describe("token groups", () => {
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
