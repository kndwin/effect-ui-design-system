import { assert, describe, it } from "@effect/vitest"
import { Layer } from "effect"
import * as Theme from "../src/feature/theme/theme.make.ts"
import * as TokenColor from "../src/platform/token/token-color.make.ts"
import * as TokenLength from "../src/platform/token/token-length.make.ts"

const Colors = TokenColor.make("color", ["surface", "fg"])
const Radius = TokenLength.make("radius", ["control"])

describe("Theme.make", () => {
  it("reads every group's values from the layer", () => {
    // Arrange
    const layer = Layer.mergeAll(
      Layer.succeed(Colors, { surface: "#ffffff", fg: "#000000" }),
      Layer.succeed(Radius, { control: "6px" })
    )
    // Act
    const theme = Theme.make({ Colors, Radius }, { name: "t", layer })
    // Assert
    assert.deepStrictEqual(theme.vars.base, {
      "--color-surface": "#ffffff",
      "--color-fg": "#000000",
      "--radius-control": "6px"
    })
  })

  it("writes only what a mode changes", () => {
    // Arrange
    const layer = Layer.mergeAll(
      Layer.succeed(Colors, { surface: "#ffffff", fg: "#000000" }),
      Layer.succeed(Radius, { control: "6px" })
    )
    const dark = Layer.succeed(Colors, { surface: "#000000", fg: "#000000" })
    // Act
    const theme = Theme.make({ Colors, Radius }, { name: "t", layer, modes: { dark } })
    // Assert
    assert.deepStrictEqual(theme.vars.modes.dark, { "--color-surface": "#000000" })
  })
})
