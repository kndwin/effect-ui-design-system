import { assert, describe, it } from "@effect/vitest"
import { getByName, getInitials } from "./avatar.pure.ts"

describe("avatar", () => {
  it("takes initials from the first and last word", () => {
    // Arrange
    const names = ["Ada Lovelace", "grace brewster hopper", "Linus"]
    // Act
    const result = names.map((name) => getInitials({ name }))
    // Assert
    assert.deepStrictEqual(result, ["AL", "GH", "L"])
  })

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
