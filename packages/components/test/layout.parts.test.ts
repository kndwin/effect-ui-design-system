import { assert, describe, it } from "@effect/vitest"
import * as Parts from "../src/layout/layout.parts.constant.ts"

describe("layout parts", () => {
  it("are single-root descriptors named after their component", () => {
    // Arrange
    const all = Object.values(Parts)
    // Act
    const names = all.map((p) => p.name)
    // Assert
    assert.include(names, "Stack")
    assert.include(names, "LayoutPanel")
    assert.strictEqual(
      all.every((p) => Object.keys(p.parts).join() === "root"),
      true
    )
  })
})
