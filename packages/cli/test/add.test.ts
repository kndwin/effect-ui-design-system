import { mkdtempSync, readdirSync, readFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { NodeServices } from "@effect/platform-node"
import { assert, describe, it } from "@effect/vitest"
import { Effect } from "effect"
import { runAdd } from "../src/feature/add/add.build.ts"

describe("runAdd", () => {
  it.effect("copies a component with everything it imports", () =>
    Effect.gen(function* () {
      // Arrange
      const dir = mkdtempSync(join(tmpdir(), "weft-add-"))
      // Act
      yield* runAdd({ names: ["dialog"], dir, overwrite: false })
      // Assert
      const files = readdirSync(dir)
      assert.includeMembers(files, ["dialog.ts", "button.ts", "tokens.ts", "scales.ts", "dialog.component.style.ts"])
      assert.notMatch(readFileSync(join(dir, "dialog.ts"), "utf8"), /from "\.\.\//)
    }).pipe(Effect.provide(NodeServices.layer))
  )

  it.effect("keeps files that are already there", () =>
    Effect.gen(function* () {
      // Arrange
      const dir = mkdtempSync(join(tmpdir(), "weft-add-"))
      yield* runAdd({ names: ["button"], dir, overwrite: false })
      // Act
      const written = yield* runAdd({ names: ["button"], dir, overwrite: false })
      // Assert
      assert.deepStrictEqual(written, [])
    }).pipe(Effect.provide(NodeServices.layer))
  )
})
