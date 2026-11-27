import { existsSync } from "node:fs"
import { dirname, parse } from "node:path"
import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../tools/lint/define.pure.ts"
import { allowed, docPath, isGoverned, kindOf } from "../../tools/lint/kinds.pure.ts"

const findDoc = (dir: string, kind: string): boolean => {
  for (let d = dir; d !== parse(d).root; d = dirname(d)) if (existsSync(docPath(d, kind))) return true
  return false
}

const check = (path: string): string | undefined => {
  const kind = kindOf(path)
  if (kind === undefined) {
    return path.endsWith("/index.ts")
      ? "No barrel files: export from the file itself and list it in package.json `exports`. See +rule/file-kind/file-kind.md."
      : `Unknown file kind. Rename to one of: ${allowed}. See +rule/file-kind/file-kind.md.`
  }
  const inTest = /\/test\//.test(path)
  if ("colocated" in kind) {
    if (inTest) return "test/ holds *.test.ts, *.test-d.ts and *.fixture.ts; *.pure.test.ts sits next to its *.pure.ts."
    if (!existsSync(path.replace(/\.test\.ts$/, ".ts"))) return "A *.pure.test.ts sits next to the *.pure.ts it tests."
  } else if ("test" in kind !== inTest) {
    return inTest
      ? "test/ holds only *.test.ts, *.test-d.ts and *.fixture.ts."
      : "Tests belong in test/ (or next to a *.pure.ts)."
  }
  if ("name" in kind && !/\/apps\//.test(path)) return "main.ts is for app entries (apps/*)."
  if ("doc" in kind && !findDoc(dirname(path), kind.doc))
    return `*${kind.suffix} files need +rule/${kind.doc}/${kind.doc}.md in this folder or an ancestor.`
  return undefined
}

export default rules(import.meta.url, {
  allowed: Rule.define({
    name: "allowed",
    meta: Rule.meta({
      type: "problem",
      description: "Source files are one of the allowed kinds. See +rule/file-kind/file-kind.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const problem = isGoverned(ctx.filename) ? check(ctx.filename) : undefined
      return { Program: (node: unknown) => (problem ? report(node, problem) : Effect.void) }
    }
  })
})
