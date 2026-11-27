import { describe, expect, it } from "vitest"
import * as Kit from "../kit/kit.make.ts"
import * as Style from "../style/style.make.ts"
import * as Theme from "../theme/theme.make.ts"
import * as TokenColor from "../tokens/token-color.make.ts"
import { compile } from "./compile.pure.ts"

const Colors = TokenColor.make("color", ["accent"])
const Parts = Kit.single("Card", { open: "[data-open]" })

describe("compile (the css-engine adapter)", () => {
  it("turns a Style into one recipe per slot, with states as selectors", () => {
    // Arrange
    const CardStyle = Style.make(Parts)({ base: { root: { color: Colors.accent, states: { open: { opacity: 1 } } } } })
    // Act
    const out = compile(CardStyle, "CardStyle")
    // Assert
    expect(out?.recipesAt).toBe("slots")
    expect(out?.recipes?.root?.debugId).toBe("Card_root")
    expect(out?.recipes?.root?.base).toEqual({
      color: "var(--color-accent)",
      selectors: { "&[data-open]": { opacity: 1 } }
    })
  })

  it("turns a Theme into global rules", () => {
    // Arrange
    const theme = Theme.make({ Colors }, { name: "t", values: { Colors: { accent: "#000" } } })
    // Act
    const out = compile(theme, "t")
    // Assert
    expect(out?.globals).toEqual([{ kind: "global", selector: '[data-theme="t"]', vars: { "--color-accent": "#000" } }])
  })

  it("leaves anything else alone", () => {
    // Arrange
    const value = 42
    // Act
    const out = compile(value, "answer")
    // Assert
    expect(out).toBeUndefined()
  })
})
