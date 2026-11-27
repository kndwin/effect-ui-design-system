import { Schema } from "effect"
import { assert, describe, it } from "@effect/vitest"
import { Tone } from "../src/scales.schema.ts"

describe("scales", () => {
  it("are Schemas apps can decode with", () => {
    // Arrange
    const decode = Schema.decodeUnknownSync(Tone)
    // Act
    const tone = decode("primary")
    // Assert
    assert.strictEqual(tone, "primary")
    assert.throws(() => decode("warning"))
  })
})
