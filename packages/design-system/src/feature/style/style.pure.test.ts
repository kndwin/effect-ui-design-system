import { assert, describe, it } from "@effect/vitest"
import { getStyleClasses } from "./style.pure.ts"

describe("getStyleClasses", () => {
  it("calls each compiled slot with only the style's variant props", () => {
    // Arrange
    const style = {
      kit: "Card",
      variants: { size: { values: ["sm", "lg"], default: "sm" } },
      slots: { root: (props?: Readonly<Record<string, unknown>>) => `Card_root ${JSON.stringify(props)}` }
    }
    // Act
    const classes = getStyleClasses({ style, props: { size: "lg", other: 1 } as { readonly size?: string } })
    // Assert
    assert.strictEqual(classes.root, 'Card_root {"size":"lg"}')
  })
})
