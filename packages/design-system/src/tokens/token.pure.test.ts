import { describe, expect, it } from "vitest"
import * as TokenColor from "./token-color.make.ts"
import { cssVarName, GroupTypeId } from "./token.pure.ts"

describe("token groups", () => {
  it("names CSS variables after prefix and key, with dots made safe", () => {
    // Arrange
    const keys = ["accent", "1.5"]
    // Act
    const names = keys.map((k) => cssVarName("spacing", k))
    // Assert
    expect(names).toEqual(["--spacing-accent", "--spacing-1_5"])
  })

  it("gives each key a var() reference and keeps the group's metadata", () => {
    // Arrange
    const keys = ["surface", "accent"] as const
    // Act
    const Colors = TokenColor.make("color", keys)
    // Assert
    expect(Colors.accent).toBe("var(--color-accent)")
    expect(Colors[GroupTypeId].kind).toBe("Color")
    expect(Colors[GroupTypeId].keys).toEqual(["surface", "accent"])
  })
})
