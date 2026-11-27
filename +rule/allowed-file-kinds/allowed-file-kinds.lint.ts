import { existsSync } from "node:fs"
import { dirname, parse } from "node:path"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"
import { allowed } from "../../tools/lint/kinds.constant.ts"
import { mapRuleKindToDocPath } from "../../tools/lint/kinds.pure.map.ts"
import { isGoverned } from "../../tools/lint/kinds.pure.predicate.ts"
import { getFileKind, getKebabProblem } from "../../tools/lint/kinds.pure.ts"

const findDoc = (dir: string, kind: string): boolean => {
  for (let d = dir; d !== parse(d).root; d = dirname(d))
    if (existsSync(mapRuleKindToDocPath({ dir: d, kind: kind }))) return true
  return false
}

const check = (path: string): string | undefined => {
  const kind = getFileKind({ path: path })
  if (kind === undefined) {
    return Match.value(path.endsWith("/index.ts")).pipe(
      Match.when(
        true,
        () =>
          "No barrel files: export from the file itself and list it in package.json `exports`. See +rule/allowed-file-kinds/allowed-file-kinds.md."
      ),
      Match.orElse(
        () => `Unknown file kind. Rename to one of: ${allowed}. See +rule/allowed-file-kinds/allowed-file-kinds.md.`
      )
    )
  }
  const inTest = /\/test\//.test(path)
  if ("colocated" in kind) {
    if (inTest) return "test/ holds *.test.ts, *.test-d.ts and *.fixture.ts; *.pure.test.ts sits next to its *.pure.ts."
    if (!existsSync(path.replace(/\.test\.ts$/, ".ts"))) return "A *.pure.test.ts sits next to the *.pure.ts it tests."
  } else if ("test" in kind !== inTest) {
    return Match.value(inTest).pipe(
      Match.when(true, () => "test/ holds only *.test.ts, *.test-d.ts and *.fixture.ts."),
      Match.orElse(() => "Tests belong in test/ (or next to a *.pure.ts).")
    )
  }
  if ("name" in kind && !/\/apps\//.test(path)) return "main.ts is for app entries (apps/*)."
  if ("doc" in kind && !findDoc(dirname(path), kind.doc))
    return `*${kind.suffix} files need +rule/${kind.doc}/${kind.doc}.md in this folder or an ancestor.`
  return undefined
}

export default RuleModule.make(import.meta.url, {
  "known-kind": Rule.define({
    name: "known-kind",
    meta: Rule.meta({
      type: "problem",
      description: "Source files are one of the allowed kinds. See +rule/allowed-file-kinds/allowed-file-kinds.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const problem = Match.value(isGoverned({ path: ctx.filename })).pipe(
        Match.when(true, () => check(ctx.filename)),
        Match.orElse(() => undefined)
      )
      return {
        Program: (node: unknown) =>
          Match.value(problem).pipe(
            Match.when(undefined, () => Effect.void),
            Match.orElse((message) => RuleModule.makeReport(node, message))
          )
      }
    }
  }),
  "kebab-case": Rule.define({
    name: "kebab-case",
    meta: Rule.meta({
      type: "problem",
      description: "File and folder names are kebab-case. See +rule/allowed-file-kinds/allowed-file-kinds.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const bad = Match.value(isGoverned({ path: ctx.filename })).pipe(
        Match.when(true, () => getKebabProblem({ path: ctx.filename })),
        Match.orElse(() => undefined)
      )
      return {
        Program: (node: unknown) =>
          Match.value(bad).pipe(
            Match.when(undefined, () => Effect.void),
            Match.orElse((segment) =>
              RuleModule.makeReport(
                node,
                `"${segment}" isn't kebab-case: rename it, e.g. profile-card.component.ts. See +rule/allowed-file-kinds/allowed-file-kinds.md.`
              )
            )
          )
      }
    }
  })
})
