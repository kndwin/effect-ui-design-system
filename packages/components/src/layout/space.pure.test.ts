import { describe, expect, it } from "vitest"
import { Space } from "../scales.pure.ts"
import { space } from "./space.pure.ts"

const rule = (gap: unknown) => ({ gap })

describe("space", () => {
  it("has one root rule per Space step, from Spacing tokens", () => {
    // Arrange
    const toRule = rule as never
    // Act
    const steps = space(toRule)
    // Assert
    expect(Object.keys(steps)).toEqual(Space.literals)
    expect(steps["4"].root).toEqual({ gap: "var(--spacing-4)" })
    expect(steps["0"].root).toEqual({ gap: 0 })
  })
})
