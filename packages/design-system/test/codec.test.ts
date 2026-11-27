import { assert, describe, it } from "@effect/vitest"
import { Schema } from "effect"
import * as TokenDuration from "../src/platform/token/token-duration.make.ts"
import * as TokenFont from "../src/platform/token/token-font.make.ts"
import * as TokenLength from "../src/platform/token/token-length.make.ts"

describe("token codecs", () => {
  it("encodes a font stack back to the names a theme writes", () => {
    // Arrange
    const css = '"Geist Mono", ui-monospace, "SFMono-Regular"'
    // Act
    const stack = Schema.encodeUnknownSync(TokenFont.ValueSchema)(css)
    // Assert
    assert.deepStrictEqual(stack, ["Geist Mono", "ui-monospace", "SFMono-Regular"])
  })

  it("encodes a duration back to an Effect DurationInput", () => {
    // Arrange
    const css = "150ms"
    // Act
    const input = Schema.encodeUnknownSync(TokenDuration.ValueSchema)(css)
    // Assert
    assert.strictEqual(input, "150 millis")
  })

  it("encodes px lengths back to numbers and keeps rem", () => {
    // Arrange
    const css = ["8px", "0.875rem"]
    // Act
    const lengths = css.map((value) => Schema.encodeUnknownSync(TokenLength.ValueSchema)(value))
    // Assert
    assert.deepStrictEqual(lengths, [8, "0.875rem"])
  })
})
