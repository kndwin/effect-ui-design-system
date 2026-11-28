import { assert, describe, it } from "@effect/vitest"
import { mapGlobToRegExp } from "./vite.pure.map.ts"

describe("mapGlobToRegExp", () => {
  it("matches files in any folder under a double star", () => {
    // Arrange
    const pattern = mapGlobToRegExp({ glob: "src/**/*.loom.ts" })
    // Act
    const matches = ["src/select.loom.ts", "src/feature/select/select.loom.ts", "src/select.ts"].map((path) =>
      pattern.test(path)
    )
    // Assert
    assert.deepStrictEqual(matches, [true, true, false])
  })
})
