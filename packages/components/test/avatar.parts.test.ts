import { assert, describe, it } from "@effect/vitest"
import { AvatarParts } from "../src/avatar/avatar.parts.constant.ts"

describe("avatar parts", () => {
  it("has root, image and fallback, with load states on the root", () => {
    // Arrange
    const parts = AvatarParts.parts
    // Act
    const names = Object.keys(parts)
    // Assert
    assert.deepStrictEqual(names, ["root", "image", "fallback"])
    assert.strictEqual(parts.root.states.loaded, "[data-status=loaded]")
  })
})
