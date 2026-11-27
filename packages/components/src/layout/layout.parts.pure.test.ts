import { describe, expect, it } from "vitest"
import * as Parts from "./layout.parts.pure.ts"

describe("layout parts", () => {
  it("are single-root descriptors named after their component", () => {
    // Arrange
    const all = Object.values(Parts)
    // Act
    const names = all.map((p) => p.name)
    // Assert
    expect(names).toContain("Stack")
    expect(names).toContain("LayoutPanel")
    expect(all.every((p) => Object.keys(p.parts).join() === "root")).toBe(true)
  })
})
