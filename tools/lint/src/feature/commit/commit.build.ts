import { text } from "node:stream/consumers"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Array, Console, Effect, String } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { repoRoot } from "../../platform/discover/discover.build.ts"
import { getPushRanges } from "./commit.pure.ts"
import { isConventionalSubject } from "./commit.pure.predicate.ts"

const loadSubjects = Effect.fn("lint/commit/loadSubjects")(function* (range: ReadonlyArray<string>) {
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const output = yield* spawner.string(
    ChildProcess.make("git", ["log", "--no-merges", "--format=%h %s", ...range], { cwd: repoRoot })
  )
  return Array.filter(String.split(output, "\n"), (line) => line !== "")
})

const main = Effect.gen(function* () {
  const input = yield* Effect.promise(() => text(process.stdin))
  const commits = Array.flatten(yield* Effect.forEach(getPushRanges({ input }), loadSubjects))
  const invalid = Array.filter(
    commits,
    (line) => !isConventionalSubject({ subject: line.slice(line.indexOf(" ") + 1) })
  )
  for (const line of invalid) yield* Console.error(`not a conventional commit: ${line}`)
  if (invalid.length > 0) {
    yield* Console.error("Subjects must look like `type(scope): description`, with type one of")
    yield* Console.error("feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert.")
    yield* Effect.sync(() => (process.exitCode = 1))
  }
})

if (import.meta.main) BunRuntime.runMain(main.pipe(Effect.provide(BunServices.layer)))
