import { assert, describe, it } from "@effect/vitest"
import { getMessage } from "./message.pure.ts"

describe("getMessage", () => {
  it("reads an Error's message and stringifies anything else", () => {
    // Arrange
    const causes = [new Error("boom"), "plain", 42]
    // Act
    const messages = causes.map((cause) => getMessage({ cause }))
    // Assert
    assert.deepStrictEqual(messages, ["boom", "plain", "42"])
  })
})
