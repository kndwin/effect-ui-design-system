import { assert, describe, it } from "@effect/vitest"
import { getClassName, getHash } from "./hash.pure.ts"

describe("hash", () => {
  it("is stable and differs by input", () => {
    // Arrange
    const inputs = ["a", "a", "b"]
    // Act
    const [first, again, other] = inputs.map((input) => getHash({ input }))
    // Assert
    assert.strictEqual(first, again)
    assert.notStrictEqual(first, other)
  })

  it("makes readable class names in debug and short ones otherwise", () => {
    // Arrange
    const args = ["src/button.ts", "Button_root", "tone_primary"] as const
    // Act
    const debug = getClassName({ scope: args[0], debugId: args[1], key: args[2], debug: true })
    const short = getClassName({ scope: args[0], debugId: args[1], key: args[2], debug: false })
    // Assert
    assert.match(debug, /^Button_root_tone_primary__[a-z0-9]+$/)
    assert.match(short, /^a[a-z0-9]+$/)
  })

  it("scopes names by file", () => {
    // Arrange
    const files = ["a.ts", "b.ts"]
    // Act
    const [a, b] = files.map((f) => getClassName({ scope: f, debugId: "Card", key: "", debug: false }))
    // Assert
    assert.notStrictEqual(a, b)
  })
})
