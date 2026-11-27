import { assert, describe, it } from "@effect/vitest"
import { className, hash } from "./hash.pure.ts"

describe("hash", () => {
  it("is stable and differs by input", () => {
    // Arrange
    const inputs = ["a", "a", "b"]
    // Act
    const [first, again, other] = inputs.map(hash)
    // Assert
    assert.strictEqual(first, again)
    assert.notStrictEqual(first, other)
  })

  it("makes readable class names in debug and short ones otherwise", () => {
    // Arrange
    const args = ["src/button.ts", "Button_root", "tone_primary"] as const
    // Act
    const debug = className(...args, true)
    const short = className(...args, false)
    // Assert
    assert.match(debug, /^Button_root_tone_primary__[a-z0-9]+$/)
    assert.match(short, /^a[a-z0-9]+$/)
  })

  it("scopes names by file", () => {
    // Arrange
    const files = ["a.ts", "b.ts"]
    // Act
    const [a, b] = files.map((f) => className(f, "Card", "", false))
    // Assert
    assert.notStrictEqual(a, b)
  })
})
