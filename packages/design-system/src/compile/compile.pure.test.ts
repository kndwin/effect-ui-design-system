import { assert, describe, it } from "@effect/vitest"
import * as Kit from "../kit/kit.make.ts"
import * as Style from "../style/style.make.ts"
import * as Theme from "../theme/theme.make.ts"
import * as TokenColor from "../tokens/token-color.make.ts"
import { composeOutput } from "./compile.pure.ts"

const Colors = TokenColor.make("color", ["accent"])
const Parts = Kit.single("Card", { open: "[data-open]" })

describe("compile (the css-engine adapter)", () => {
  it("turns a Style into one recipe per slot, with states as selectors", () => {
    // Arrange
    const CardStyle = Style.make(Parts)({ base: { root: { color: Colors.accent, states: { open: { opacity: 1 } } } } })
    // Act
    const out = composeOutput({ value: CardStyle, exportName: "CardStyle" })
    // Assert
    assert.strictEqual(out?.recipesAt, "slots")
    assert.strictEqual(out?.recipes?.root?.debugId, "Card_root")
    assert.deepStrictEqual(out?.recipes?.root?.base, {
      color: "var(--color-accent)",
      selectors: { "&[data-open]": { opacity: 1 } }
    })
  })

  it("turns a Theme into global rules", () => {
    // Arrange
    const theme = Theme.make({ Colors }, { name: "t", values: { Colors: { accent: "#000" } } })
    // Act
    const out = composeOutput({ value: theme, exportName: "t" })
    // Assert
    assert.deepStrictEqual(out?.globals, [
      { kind: "global", selector: '[data-theme="t"]', vars: { "--color-accent": "#000" } }
    ])
  })

  it("leaves anything else alone", () => {
    // Arrange
    const value = 42
    // Act
    const out = composeOutput({ value: value, exportName: "answer" })
    // Assert
    assert.isUndefined(out)
  })
})
