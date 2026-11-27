import { assert, describe, it } from "@effect/vitest"
import { manifest } from "../src/manifest.constant.ts"

describe("manifest", () => {
  it("lists every component with its variants", () => {
    // Arrange
    const button = manifest.components.find((c) => c.kit === "Button")
    // Act
    const tones = button?.variants.tone?.values
    // Assert
    assert.deepStrictEqual(tones, ["primary", "neutral", "danger", "ghost"])
  })

  it("lists the contract's groups with their kinds", () => {
    // Arrange
    const groups = manifest.tokens
    // Act
    const kinds = [groups.Colors.kind, groups.Spacing.kind, groups.Font.kind]
    // Assert
    assert.deepStrictEqual(kinds, ["Color", "Length", "Font"])
  })
})
