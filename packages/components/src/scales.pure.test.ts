import { Schema } from "effect"
import { describe, expect, it } from "vitest"
import { Tone } from "./scales.pure.ts"

describe("scales", () => {
  it("are Schemas apps can decode with", () => {
    // Arrange
    const decode = Schema.decodeUnknownSync(Tone)
    // Act
    const tone = decode("primary")
    // Assert
    expect(tone).toBe("primary")
    expect(() => decode("warning")).toThrow()
  })
})
