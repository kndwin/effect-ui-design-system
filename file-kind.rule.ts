import { existsSync } from "node:fs"
import { dirname, join, parse } from "node:path"
import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "./tools/lint/define.pure.ts"
import { allowed, isGoverned, kindOf } from "./tools/lint/kinds.pure.ts"

const findDoc = (dir: string, doc: string): boolean => {
  for (let d = dir; d !== parse(d).root; d = dirname(d)) if (existsSync(join(d, doc))) return true
  return false
}

const check = (path: string): string | undefined => {
  const kind = kindOf(path)
  if (kind === undefined) {
    return path.endsWith("/index.ts")
      ? "No barrel files: export from the file itself and list it in package.json `exports`. See file-kind.rule.md."
      : `Unknown file kind. Rename to one of: ${allowed}. See file-kind.rule.md.`
  }
  const inTest = /\/test\//.test(path)
  const isTest = "test" in kind
  if (isTest !== inTest)
    return inTest ? "test/ holds only *.test.ts, *.test-d.ts and *.fixture.ts." : "Tests belong in test/."
  if ("name" in kind && !/\/apps\//.test(path)) return "main.ts is for app entries (apps/*)."
  if ("doc" in kind && !findDoc(dirname(path), `${kind.doc}.rule.md`))
    return `*${kind.suffix} files need a ${kind.doc}.rule.md in this folder or an ancestor.`
  return undefined
}

export default rules(import.meta.url, {
  allowed: Rule.define({
    name: "allowed",
    meta: Rule.meta({
      type: "problem",
      description: "Source files are one of the allowed kinds. See file-kind.rule.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const problem = isGoverned(ctx.filename) ? check(ctx.filename) : undefined
      return { Program: (node: unknown) => (problem ? report(node, problem) : Effect.void) }
    }
  }),
  "vanilla-imports": Rule.define({
    name: "vanilla-imports",
    meta: Rule.meta({
      type: "problem",
      description: "Only *.build.ts imports vanilla-extract. See file-kind.rule.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const allowedHere = !isGoverned(ctx.filename) || ctx.filename.endsWith(".build.ts")
      return {
        ImportDeclaration: (node: any) =>
          !allowedHere &&
          node.importKind !== "type" &&
          typeof node.source?.value === "string" &&
          node.source.value.startsWith("@vanilla-extract/")
            ? report(node, "vanilla-extract is a build detail of @acme/css-engine. See file-kind.rule.md.")
            : Effect.void
      }
    }
  })
})
