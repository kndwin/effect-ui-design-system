import { assert, describe, it } from "@effect/vitest"
import { mapSourceToExampleMeta, mapSourceToRecipe } from "./example.pure.map.ts"

describe("mapSourceToExampleMeta", () => {
  it("reads the title and order an example exports", () => {
    // Arrange
    const source = 'export const title = "Pick a day"\nexport const order = 2\n'
    // Act
    const meta = mapSourceToExampleMeta({ source, file: "booking" })
    // Assert
    assert.deepStrictEqual(meta, { title: "Pick a day", order: 2 })
  })

  it("falls back to the file name and last place", () => {
    // Arrange
    const source = "export default 1\n"
    // Act
    const meta = mapSourceToExampleMeta({ source, file: "date-range" })
    // Assert
    assert.deepStrictEqual(meta, { title: "Date range", order: 99 })
  })
})

describe("mapSourceToRecipe", () => {
  it("imports components from the app's own copies", () => {
    // Arrange
    const source = [
      'import { Button } from "@weft/components/button"',
      'import { VStack } from "@weft/components/layout/stack"',
      'import * as Theme from "@weft/design-system/Theme"'
    ].join("\n")
    // Act
    const recipe = mapSourceToRecipe({ source })
    // Assert
    assert.strictEqual(
      recipe,
      [
        'import { Button } from "@/components/ui/button"',
        'import { VStack } from "@/components/ui/stack"',
        'import * as Theme from "@weft/design-system/Theme"'
      ].join("\n")
    )
  })
})
