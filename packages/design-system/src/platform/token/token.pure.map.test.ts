import { assert, describe, it } from "@effect/vitest"
import { mapTokenKeyToCssVarName } from "./token.pure.map.ts"
describe("mapTokenKeyToCssVarName", () => {
  it("names CSS variables after prefix and key, with dots made safe", () => {
    // Arrange
    const keys = ["accent", "1.5"]
    // Act
    const names = keys.map((key) => mapTokenKeyToCssVarName({ prefix: "spacing", key }))
    // Assert
    assert.deepStrictEqual(names, ["--spacing-accent", "--spacing-1_5"])
  })
})
