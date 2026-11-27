import { assert, describe, it } from "@effect/vitest"
import { mapCauseToMessage } from "./message.pure.map.ts"

describe("mapCauseToMessage", () => {
  it("reads an Error's message and stringifies anything else", () => {
    // Arrange
    const causes = [new Error("boom"), "plain", 42]
    // Act
    const messages = causes.map((cause) => mapCauseToMessage({ cause }))
    // Assert
    assert.deepStrictEqual(messages, ["boom", "plain", "42"])
  })
})
