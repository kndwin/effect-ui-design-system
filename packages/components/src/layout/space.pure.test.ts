import { assert, describe, it } from "@effect/vitest"
import { Space } from "../scales.schema.ts"
import { space } from "./space.pure.ts"

const rule = (gap: unknown) => ({ gap })

describe("space", () => {
  it("has one root rule per Space step, from Spacing tokens", () => {
    // Arrange
    const toRule = rule as never
    // Act
    const steps = space(toRule)
    // Assert
    assert.deepStrictEqual(Object.keys(steps), [...Space.literals])
    assert.deepStrictEqual<unknown>(steps["4"].root, { gap: "var(--spacing-4)" })
    assert.deepStrictEqual(steps["0"].root, { gap: 0 })
  })
})
