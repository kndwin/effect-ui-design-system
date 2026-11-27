import { describe, expect, it } from "vitest"
import { AvatarParts, initials, pickByName } from "./avatar.parts.pure.ts"

describe("avatar parts", () => {
  it("has root, image and fallback, with load states on the root", () => {
    // Arrange
    const parts = AvatarParts.parts
    // Act
    const names = Object.keys(parts)
    // Assert
    expect(names).toEqual(["root", "image", "fallback"])
    expect(parts.root.states.loaded).toBe("[data-status=loaded]")
  })

  it("takes initials from the first and last word", () => {
    // Arrange
    const names = ["Ada Lovelace", "grace brewster hopper", "Linus"]
    // Act
    const result = names.map(initials)
    // Assert
    expect(result).toEqual(["AL", "GH", "L"])
  })

  it("picks the same value for the same name", () => {
    // Arrange
    const hues = ["blue", "green", "amber", "rose"] as const
    // Act
    const first = pickByName("Ada Lovelace", hues)
    const again = pickByName("Ada Lovelace", hues)
    // Assert
    expect(first).toBe(again)
    expect(hues).toContain(first)
  })
})
