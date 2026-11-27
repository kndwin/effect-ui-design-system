import { join } from "node:path"
import { Array, Effect, FileSystem, HashSet, Path } from "effect"

const skip = HashSet.make("node_modules", "vendor", "dist", ".git", "__rule_tests__")

export const repoRoot = join(import.meta.dirname, "..", "..")

export type RuleExt = "md" | "yml" | "lint.ts"

const ruleDirs = (dir: string): Effect.Effect<ReadonlyArray<string>, never, FileSystem.FileSystem | Path.Path> =>
  Effect.gen(function* () {
    const fs = yield* FileSystem.FileSystem
    const path = yield* Path.Path
    const entries = yield* fs.readDirectoryEntries(dir).pipe(Effect.orElseSucceed(() => []))
    const nested = yield* Effect.forEach(
      Array.filter(entries, (e) => e.type === "Directory" && !HashSet.has(skip, e.name)),
      (e) => (e.name === "+rule" ? Effect.succeed([path.join(dir, e.name)]) : ruleDirs(path.join(dir, e.name)))
    )
    return Array.flatten(nested)
  })

export const findRuleFiles = Effect.fn("lint/findRuleFiles")(function* (ext: RuleExt, dir: string = repoRoot) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const files = yield* Effect.forEach(yield* ruleDirs(dir), (ruleDir) =>
    Effect.gen(function* () {
      const rules = yield* fs.readDirectoryEntries(ruleDir)
      return yield* Effect.filter(
        Array.map(
          Array.filter(rules, (e) => e.type === "Directory"),
          (e) => path.join(ruleDir, e.name, `${e.name}.${ext}`)
        ),
        (file) => fs.exists(file)
      )
    })
  )
  return Array.flatten(files)
})
