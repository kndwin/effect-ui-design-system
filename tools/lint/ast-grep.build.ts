import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Array, Console, Effect, Match, Path, Schema } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { scanRuleFiles, repoRoot } from "./discover.build.ts"
import { kinds } from "./kinds.constant.ts"
import { isInScope } from "./kinds.pure.predicate.ts"
import { mapRuleFileToRuleKind, mapRuleFileToScope } from "./kinds.pure.map.ts"

export interface Match {
  readonly ruleId: string
  readonly file: string
  readonly line: number
  readonly message: string
}

const Found = Schema.fromJsonString(
  Schema.Array(
    Schema.Struct({
      ruleId: Schema.String,
      file: Schema.String,
      message: Schema.String,
      range: Schema.Struct({ start: Schema.Struct({ line: Schema.Number }) })
    })
  )
)

const scanRule = Effect.fn("lint/ast-grep/scanRule")(function* (ruleFile: string, only?: ReadonlyArray<string>) {
  const path = yield* Path.Path
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const dir = mapRuleFileToScope({ ruleFile: ruleFile })
  const targets = Match.value(only).pipe(
    Match.when(undefined, () => ["."]),
    Match.orElse((files) =>
      Array.map(
        Array.filter(files, (f) => isInScope({ ruleFile: ruleFile, file: f })),
        (f) => path.relative(dir, f)
      )
    )
  )
  if (targets.length === 0) return []
  const globs = Array.flatMap(kinds[mapRuleFileToRuleKind({ ruleFile: ruleFile })] ?? [], (s) => [
    "--globs",
    `**/*${s}`
  ])
  const output = yield* spawner.string(
    ChildProcess.make(
      path.join(repoRoot, "node_modules", ".bin", "ast-grep"),
      [
        "scan",
        "--rule",
        ruleFile,
        ...globs,
        "--globs",
        "!**/node_modules/**",
        "--globs",
        "!vendor/**",
        "--json=compact",
        ...targets
      ],
      { cwd: dir }
    )
  )
  const found = yield* Schema.decodeUnknownEffect(Found)(output.trim() || "[]")
  return Array.filter(
    Array.map(found, (m) => ({
      ruleId: m.ruleId,
      file: path.join(dir, m.file),
      line: m.range.start.line + 1,
      message: m.message
    })),
    (m) => isInScope({ ruleFile: ruleFile, file: m.file })
  )
})

export const scan = Effect.fn("lint/ast-grep/scan")(function* (only?: ReadonlyArray<string>) {
  const rules = yield* scanRuleFiles("yml")
  const found = yield* Effect.forEach(rules, (ruleFile) => scanRule(ruleFile, only))
  return { rules: rules.length, matches: Array.flatten(found) }
})

const main = Effect.gen(function* () {
  const path = yield* Path.Path
  const { rules, matches } = yield* scan()
  for (const m of matches)
    yield* Console.log(`${path.relative(repoRoot, m.file)}:${m.line}: error ${m.ruleId}: ${m.message}`)
  yield* Console.log(`ast-grep: ${matches.length} problem(s) from ${rules} rule file(s)`)
  if (matches.length > 0) yield* Effect.sync(() => (process.exitCode = 1))
})

if (import.meta.main) BunRuntime.runMain(main.pipe(Effect.provide(BunServices.layer)))
