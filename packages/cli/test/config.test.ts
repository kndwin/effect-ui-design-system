import { mkdtempSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { NodeServices } from "@effect/platform-node"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Option } from "effect"
import { InvalidConfigError, loadPaths } from "../src/platform/config/config.build.ts"

describe("loadPaths", () => {
  it.effect("takes a flag over components.json, and components.json over the defaults", () =>
    Effect.gen(function* () {
      // Arrange
      const cwd = mkdtempSync(join(tmpdir(), "weft-config-"))
      writeFileSync(join(cwd, "components.json"), JSON.stringify({ ui: "app/ui" }))
      // Act
      const configured = yield* loadPaths(cwd, { ui: Option.none(), themes: Option.none() })
      const flagged = yield* loadPaths(cwd, { ui: Option.some("lib/ui"), themes: Option.none() })
      // Assert
      assert.deepStrictEqual([configured.ui, configured.themes], ["app/ui", "src"])
      assert.strictEqual(flagged.ui, "lib/ui")
    }).pipe(Effect.provide(NodeServices.layer))
  )

  it.effect("fails on a components.json it can't read", () =>
    Effect.gen(function* () {
      // Arrange
      const cwd = mkdtempSync(join(tmpdir(), "weft-config-"))
      writeFileSync(join(cwd, "components.json"), JSON.stringify({ packageManager: "pip" }))
      // Act
      const error = yield* Effect.flip(loadPaths(cwd, { ui: Option.none(), themes: Option.none() }))
      // Assert
      assert.instanceOf(error, InvalidConfigError)
    }).pipe(Effect.provide(NodeServices.layer))
  )
})
