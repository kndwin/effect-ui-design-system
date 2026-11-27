import { describe, expect, it } from "vitest"
import { className, hash } from "./hash.pure.ts"

describe("hash", () => {
  it("is stable and differs by input", () => {
    // Arrange
    const inputs = ["a", "a", "b"]
    // Act
    const [first, again, other] = inputs.map(hash)
    // Assert
    expect(first).toBe(again)
    expect(first).not.toBe(other)
  })

  it("makes readable class names in debug and short ones otherwise", () => {
    // Arrange
    const args = ["src/button.ts", "Button_root", "tone_primary"] as const
    // Act
    const debug = className(...args, true)
    const short = className(...args, false)
    // Assert
    expect(debug).toMatch(/^Button_root_tone_primary__[a-z0-9]+$/)
    expect(short).toMatch(/^a[a-z0-9]+$/)
  })

  it("scopes names by file", () => {
    // Arrange
    const files = ["a.ts", "b.ts"]
    // Act
    const [a, b] = files.map((f) => className(f, "Card", "", false))
    // Assert
    expect(a).not.toBe(b)
  })
})
