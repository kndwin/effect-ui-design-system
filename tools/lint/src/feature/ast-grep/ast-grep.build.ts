import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Array, Console, Effect, Match, Path, Schema } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { scanRuleFiles, repoRoot } from "../../platform/discover/discover.build.ts"
import { kinds } from "../../platform/kind/kinds.constant.ts"
import { isInScope } from "../../platform/kind/kinds.pure.predicate.ts"
import { mapRuleFileToRuleKind, mapRuleFileToScope } from "../../platform/kind/kinds.pure.map.ts"
import { AstGrepOutputSchema, type Finding } from "./ast-grep.schema.ts"

const scanRule = Effect.fn("lint/ast-grep/scanRule")(function* (ruleFile: string, only?: ReadonlyArray<string>) {
  const path = yield* Path.Path
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const dir = mapRuleFileToScope({ ruleFile })
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
  const globs = Array.flatMap(kinds[mapRuleFileToRuleKind({ ruleFile })] ?? [], (s) => ["--globs", `**/*${s}`])
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
  const found = yield* Schema.decodeUnknownEffect(AstGrepOutputSchema)(output.trim() || "[]")
  return Array.filter(
    Array.map(found, (m): Finding => ({
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
