import { assert, describe, it } from "@effect/vitest"
import { composeSpaceVariants } from "./space.pure.ts"

describe("space", () => {
  it("has one root rule per Space step, from Spacing tokens", () => {
    // Arrange
    const property = "gap" as const
    // Act
    const steps = composeSpaceVariants({ property })
    // Assert
    assert.deepStrictEqual(Object.keys(steps), ["0", "1", "2", "3", "4", "6", "8", "12"])
    assert.deepStrictEqual<unknown>(steps["4"].root, { gap: "var(--spacing-4)" })
    assert.deepStrictEqual(steps["0"].root, { gap: 0 })
  })
})
