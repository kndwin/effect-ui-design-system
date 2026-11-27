import { assert, describe, it } from "@effect/vitest"
import * as TokenColor from "../../platform/token/token-color.make.ts"
import * as TokenFont from "../../platform/token/token-font.make.ts"
import * as TokenLength from "../../platform/token/token-length.make.ts"
import { mapVarsToThemeSource } from "./theme-source.pure.map.ts"

const tokens = {
  Colors: TokenColor.make("color", ["surface"]),
  Radius: TokenLength.make("radius", ["control"]),
  Font: TokenFont.make("font", ["body"])
}

const vars = { "--color-surface": "#ffffff", "--radius-control": "8px", "--font-body": '"Geist", sans-serif' }

describe("mapVarsToThemeSource", () => {
  it("writes each group as a Layer.succeed of its source values", () => {
    // Arrange
    const input = { tokens, name: "my-brand", isDefault: true, vars, modes: {}, tokensImport: "./tokens.ts" }
    // Act
    const source = mapVarsToThemeSource(input)
    // Assert
    assert.strictEqual(
      source,
      [
        'import { Tokens } from "./tokens.ts"',
        'import * as Theme from "@weft/design-system/Theme"',
        'import { Layer } from "effect"',
        "",
        "export const myBrand = Theme.make(Tokens, {",
        '  name: "my-brand",',
        "  default: true,",
        "  layer: Layer.mergeAll(",
        "    Layer.succeed(Tokens.Colors, {",
        '      surface: "#ffffff"',
        "    }),",
        "    Layer.succeed(Tokens.Radius, {",
        "      control: 8",
        "    }),",
        "    Layer.succeed(Tokens.Font, {",
        '      body: ["Geist", "sans-serif"]',
        "    })",
        "  )",
        "})",
        ""
      ].join("\n")
    )
  })

  it("gives a mode only the groups it changes", () => {
    // Arrange
    const modes = { dark: { "--color-surface": "#000000", "--radius-control": "8px" } }
    const input = { tokens, name: "t", isDefault: false, vars, modes, tokensImport: "./tokens.ts" }
    // Act
    const source = mapVarsToThemeSource(input)
    // Assert
    assert.include(
      source,
      '  modes: {\n    dark: Layer.mergeAll(\n      Layer.succeed(Tokens.Colors, {\n        surface: "#000000"\n      })\n    )\n  }'
    )
    assert.notInclude(source.slice(source.indexOf("modes")), "Radius")
  })
})
