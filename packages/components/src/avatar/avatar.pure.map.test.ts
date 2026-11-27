import { assert, describe, it } from "@effect/vitest"
import { mapNameToInitials } from "./avatar.pure.map.ts"
describe("mapNameToInitials", () => {
  it("takes initials from the first and last word", () => {
    // Arrange
    const names = ["Ada Lovelace", "grace brewster hopper", "Linus"]
    // Act
    const result = names.map((name) => mapNameToInitials({ name }))
    // Assert
    assert.deepStrictEqual(result, ["AL", "GH", "L"])
  })
})
