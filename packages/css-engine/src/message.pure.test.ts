import { assert, describe, it } from "@effect/vitest"
import { messageOf } from "./message.pure.ts"

describe("messageOf", () => {
  it("reads an Error's message and stringifies anything else", () => {
    // Arrange
    const causes = [new Error("boom"), "plain", 42]
    // Act
    const messages = causes.map(messageOf)
    // Assert
    assert.deepStrictEqual(messages, ["boom", "plain", "42"])
  })
})
