import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { dirname, join, relative } from "node:path"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { scan } from "./ast-grep.build.ts"
import { findRuleFiles, repoRoot } from "./discover.build.ts"
import { kinds, ruleKindOf } from "./kinds.pure.ts"

interface Example {
  readonly kind: string
  readonly title: string
  readonly good: boolean
  readonly expected: string | undefined
  readonly path: string
  readonly code: string
}

const block = /^## (.*)$|^```ts (good|bad)(?: path=(\S+))?\n([\s\S]*?)^```$/gm

const examplesOf = (mdFile: string): ReadonlyArray<Example> => {
  const kind = ruleKindOf(mdFile)
  const first = kinds[kind]?.[0] ?? ".ts"
  const suffix = first === ".ts" ? ".pure.ts" : first
  let heading = ""
  return [...readFileSync(mdFile, "utf8").matchAll(block)].flatMap((m, i) => {
    if (m[1] !== undefined) {
      heading = m[1]
      return []
    }
    return [
      {
        kind,
        title: `${heading} (${relative(repoRoot, mdFile)} #${i})`,
        good: m[2] === "good",
        expected: heading.match(/→\s*(\S+)/)?.[1],
        path: m[3] ? join(repoRoot, m[3]) : join(dirname(mdFile), "__rule_tests__", `${kind}-${i}${suffix}`),
        code: m[4] ?? ""
      }
    ]
  })
}

const examples = findRuleFiles("md").flatMap(examplesOf)
const found = new Map<string, Set<string>>()

const oxlint = (files: ReadonlyArray<string>): string => {
  try {
    return execFileSync(
      join(repoRoot, "node_modules", ".bin", "oxlint"),
      ["--disable-nested-config", "-c", "oxlint.config.ts", "-f", "json", ...files],
      { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 64 * 1024 * 1024 }
    )
  } catch (error) {
    return (error as { stdout?: string }).stdout ?? "{}"
  }
}

const add = (file: string, id: string) => found.set(file, (found.get(file) ?? new Set()).add(id))

beforeAll(() => {
  for (const e of examples) {
    mkdirSync(dirname(e.path), { recursive: true })
    writeFileSync(e.path, e.code)
  }
  const files = examples.map((e) => e.path)
  const { diagnostics } = JSON.parse(oxlint(files)) as {
    diagnostics?: ReadonlyArray<{ code: string; filename: string }>
  }
  for (const d of diagnostics ?? []) {
    const id = d.code.match(/^acme\((.+)\)$/)?.[1]
    if (id) add(join(repoRoot, d.filename), id)
  }
  for (const m of scan(files)) add(m.file, m.ruleId)
}, 120_000)

afterAll(() => {
  for (const e of examples) rmSync(e.path, { force: true })
  for (const dir of new Set(examples.map((e) => dirname(e.path)))) rmSync(dir, { recursive: true, force: true })
  rmSync(join(repoRoot, "packages", "__rules__"), { recursive: true, force: true })
})

describe("every *.rule.md example", () => {
  it("has examples", () => expect(examples.length).toBeGreaterThan(10))
  for (const e of examples) {
    it(`${e.good ? "✅" : "❌"} ${e.kind}: ${e.title}`, () => {
      const ids = [...(found.get(e.path) ?? [])]
      if (e.good) expect(ids.filter((id) => id.startsWith(`${e.kind}/`))).toEqual([])
      else expect(ids).toContain(e.expected)
    })
  }
})
