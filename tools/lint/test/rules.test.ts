import { BunServices } from "@effect/platform-bun"
import { assert, layer } from "@effect/vitest"
import { Array, Context, Effect, FileSystem, Layer, Match, MutableHashMap, Option, Path, Schema } from "effect"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { scan } from "../src/feature/ast-grep/ast-grep.build.ts"
import { scanRuleFiles, repoRoot } from "../src/platform/discover/discover.build.ts"
import { mapRuleFileToRuleKind, mapRuleFileToScope } from "../src/platform/kind/kinds.pure.map.ts"
import { getRuleSuffixes } from "../src/platform/kind/kinds.pure.ts"

interface Example {
  readonly kind: string
  readonly title: string
  readonly good: boolean
  readonly expected: string | undefined
  readonly path: string
  readonly code: string
  readonly untested: boolean
}

const block = /^## (.*)$|^```ts (good|bad)([^\n]*)\n([\s\S]*?)^```$/gm

const examplesOf = Effect.fn("lint/rules/examplesOf")(function* (mdFile: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const kind = mapRuleFileToRuleKind({ ruleFile: mdFile })
  const first = getRuleSuffixes({ ruleFile: mdFile })[0] ?? ".ts"
  const suffix = Match.value(first === ".ts").pipe(
    Match.when(true, () => ".pure.ts"),
    Match.orElse(() => first)
  )
  const text = yield* fs.readFileString(mdFile)
  let heading = ""
  return Array.flatMap([...text.matchAll(block)], (m, i): ReadonlyArray<Example> => {
    if (m[1] !== undefined) {
      heading = m[1]
      return []
    }
    const at = m[3]?.match(/path=(\S+)/)?.[1]
    return [
      {
        kind,
        title: `${heading} (${path.relative(repoRoot, mdFile)} #${i})`,
        good: m[2] === "good",
        expected: heading.match(/→\s*(\S+)/)?.[1],
        path: Match.value(at).pipe(
          Match.when(undefined, () =>
            path.join(mapRuleFileToScope({ ruleFile: mdFile }), "__rule_tests__", `${kind}-${i}${suffix}`)
          ),
          Match.orElse((given) => path.join(repoRoot, given))
        ),
        code: m[4] ?? "",
        untested: /\buntested\b/.test(m[3] ?? "")
      }
    ]
  })
})

const { mdFiles, examples } = await Effect.runPromise(
  Effect.gen(function* () {
    const files = yield* scanRuleFiles("md")
    return { mdFiles: files, examples: Array.flatten(yield* Effect.forEach(files, examplesOf)) }
  }).pipe(Effect.provide(BunServices.layer))
)

const OxlintReport = Schema.fromJsonString(
  Schema.Struct({
    diagnostics: Schema.optionalKey(Schema.Array(Schema.Struct({ code: Schema.String, filename: Schema.String })))
  })
)

const siblingTest = (file: string) => file.replace(/\.pure\.ts$/, ".pure.test.ts")

const writeExamples = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  for (const e of examples) {
    yield* fs.makeDirectory(path.dirname(e.path), { recursive: true })
    yield* fs.writeFileString(e.path, e.code)
    if (e.path.endsWith(".pure.ts") && !e.untested) yield* fs.writeFileString(siblingTest(e.path), "export {}\n")
  }
})

const removeExamples = Effect.gen(function* () {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const dirs = new Set(Array.map(examples, (e) => path.dirname(e.path)))
  for (const e of examples) {
    yield* fs.remove(e.path, { force: true })
    yield* fs.remove(siblingTest(e.path), { force: true })
  }
  for (const dir of [...dirs, path.join(repoRoot, "packages", "__rules__")])
    yield* fs.remove(dir, { recursive: true, force: true })
}).pipe(Effect.orDie)

const oxlint = Effect.gen(function* () {
  const path = yield* Path.Path
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const output = yield* spawner.string(
    ChildProcess.make(
      path.join(repoRoot, "node_modules", ".bin", "bun"),
      [
        "--bun",
        "x",
        "oxlint",
        "--disable-nested-config",
        "-c",
        "oxlint.config.ts",
        "-f",
        "json",
        ...Array.map(examples, (e) => e.path)
      ],
      { cwd: repoRoot }
    )
  )
  const { diagnostics } = yield* Schema.decodeUnknownEffect(OxlintReport)(output)
  return Array.flatMap(diagnostics ?? [], (d) => {
    const ruleId = d.code.match(/^acme\((.+)\)$/)?.[1]
    return Match.value(ruleId).pipe(
      Match.when(undefined, () => []),
      Match.orElse((id) => [{ file: path.join(repoRoot, d.filename), ruleId: id }])
    )
  })
})

class Findings extends Context.Service<Findings, MutableHashMap.MutableHashMap<string, ReadonlyArray<string>>>()(
  "acme/lint/Findings"
) {
  static readonly layer = Layer.effect(
    Findings,
    Effect.gen(function* () {
      yield* Effect.acquireRelease(writeExamples, () => removeExamples)
      const files = Array.map(examples, (e) => e.path)
      const reported = [...(yield* oxlint), ...(yield* scan(files)).matches]
      const found = MutableHashMap.empty<string, ReadonlyArray<string>>()
      for (const { file, ruleId } of reported)
        MutableHashMap.set(found, file, [...Option.getOrElse(MutableHashMap.get(found, file), () => []), ruleId])
      return found
    })
  ).pipe(Layer.provide(BunServices.layer))
}

layer(Findings.layer, { timeout: "120 seconds" })("every +rule md example", (it) => {
  it("has examples", () => {
    // Arrange
    const files = mdFiles
    // Act
    const count = examples.length
    // Assert
    assert.isAbove(count, files.length)
  })

  for (const e of examples) {
    it.effect(
      `${Match.value(e.good).pipe(
        Match.when(true, () => "✅"),
        Match.orElse(() => "❌")
      )} ${e.kind}: ${e.title}`,
      () =>
        Effect.gen(function* () {
          // Arrange
          const found = yield* Findings
          // Act
          const ids = Option.getOrElse(MutableHashMap.get(found, e.path), () => [])
          // Assert
          if (e.good)
            assert.deepStrictEqual(
              ids.filter((id) => id.startsWith(`${e.kind}/`)),
              []
            )
          else assert.include(ids, e.expected)
        })
    )
  }
})
