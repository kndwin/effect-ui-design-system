import { mkdtempSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { NodeServices } from "@effect/platform-node"
import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import { runTheme, UnknownThemeError } from "../src/feature/theme/theme.build.ts"

describe("runTheme", () => {
  it.effect("writes a default theme that imports your copy of the contract", () =>
    Effect.gen(function* () {
      // Arrange
      const root = mkdtempSync(join(tmpdir(), "weft-theme-"))
      const options = {
        base: "astryx",
        name: "acme",
        dir: join(root, "src"),
        ui: join(root, "src/components/ui"),
        overwrite: false
      }
      // Act
      yield* runTheme(options)
      // Assert
      const theme = readFileSync(join(root, "src/acme.theme.ts"), "utf8")
      assert.include(theme, 'from "./components/ui/tokens.ts"')
      assert.include(theme, 'export const acme = Theme.make(Tokens, {\n  name: "acme",\n  default: true,')
      assert.include(readFileSync(join(root, "src/components/ui/tokens.ts"), "utf8"), "TokenColor.make")
    }).pipe(Effect.provide(NodeServices.layer))
  )

  it.effect("rejects a theme it doesn't ship", () =>
    Effect.gen(function* () {
      // Arrange
      const options = { base: "nope", name: "acme", dir: "src", ui: "src/components/ui", overwrite: false }
      // Act
      const error = yield* Effect.flip(runTheme(options))
      // Assert
      assert.instanceOf(error, UnknownThemeError)
    }).pipe(Effect.provide(NodeServices.layer))
  )
})
