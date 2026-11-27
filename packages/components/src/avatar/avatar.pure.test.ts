import { assert, describe, it } from "@effect/vitest"
import { getByName } from "./avatar.pure.ts"
describe("avatar", () => {
  it("picks the same value for the same name", () => {
    // Arrange
    const hues = ["blue", "green", "amber", "rose"] as const
    // Act
    const first = getByName({ name: "Ada Lovelace", values: hues })
    const again = getByName({ name: "Ada Lovelace", values: hues })
    // Assert
    assert.strictEqual(first, again)
    assert.include(hues, first)
  })
})
