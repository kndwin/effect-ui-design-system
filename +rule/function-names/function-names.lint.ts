import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"

interface Convention {
  readonly suffix: string
  readonly pattern: RegExp
  readonly expected: string
  readonly every?: boolean
}

const conventions: ReadonlyArray<Convention> = [
  { suffix: ".pure.map.ts", pattern: /^map[A-Z]\w*To[A-Z]\w*$/, expected: "mapXToY" },
  { suffix: ".pure.predicate.ts", pattern: /^(is|has|should)[A-Z]/, expected: "is…, has… or should…" },
  { suffix: ".pure.ts", pattern: /^(get|compose)[A-Z]/, expected: "get… or compose…" },
  { suffix: ".make.ts", pattern: /^make([A-Z]\w*)?$/, expected: "make or make…" },
  {
    suffix: ".build.ts",
    pattern: /^(make|load|run|compile|watch|scan)([A-Z]\w*)?$/,
    expected: "make, load, run, compile, watch or scan…"
  },
  {
    suffix: ".component.ts",
    pattern: /^([A-Z]\w*|on[A-Z]\w*)$/,
    expected: "a PascalCase component, or on… for a handler"
  },
  { suffix: ".define.ts", pattern: /^[A-Z]\w*Def$/, expected: "…Def", every: true },
  {
    suffix: ".update.ts",
    pattern: /^(update|handle[A-Z]\w*)$/,
    expected: "update, or handle… for a slice",
    every: true
  },
  {
    suffix: ".view.ts",
    pattern: /^(view|head|[A-Z]\w*)$/,
    expected: "view, head, or a PascalCase fragment",
    every: true
  },
  { suffix: ".command.ts", pattern: /^[A-Z]\w*$/, expected: "a PascalCase Command", every: true },
  { suffix: ".subscription.ts", pattern: /^subscriptions$/, expected: "subscriptions", every: true },
  { suffix: ".route.ts", pattern: /^[A-Z]\w*Route$/, expected: "…Route", every: true }
]

const isFunctionLike = (init: any): boolean =>
  Match.value(init?.type).pipe(
    Match.whenOr("ArrowFunctionExpression", "FunctionExpression", () => true),
    Match.when("CallExpression", () => isFunctionLike(init.callee) || init.callee?.object?.name === "Effect"),
    Match.orElse(() => false)
  )

const exportedNames = (node: any): ReadonlyArray<{ readonly name: string; readonly isFunction: boolean }> =>
  Match.value(node.declaration?.type).pipe(
    Match.when("VariableDeclaration", () =>
      node.declaration.declarations.map((v: any) => ({ name: v.id?.name ?? "", isFunction: isFunctionLike(v.init) }))
    ),
    Match.when("FunctionDeclaration", () => [{ name: node.declaration.id?.name ?? "", isFunction: true }]),
    Match.orElse(() => [])
  )

const see = "See +rule/function-names/function-names.md."

export default RuleModule.make(import.meta.url, {
  prefix: Rule.define({
    name: "prefix",
    meta: Rule.meta({
      type: "problem",
      description: `Exported functions are named for their file kind. ${see}`
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const convention = conventions.find((c) => ctx.filename.endsWith(c.suffix))
      return {
        ExportNamedDeclaration: (node: any) =>
          Effect.forEach(
            exportedNames(node).filter((e) => e.isFunction || convention?.every === true),
            ({ name }) =>
              Match.value(convention).pipe(
                Match.when(undefined, () => Effect.void),
                Match.orElse((c) =>
                  Match.value(c.pattern.test(name)).pipe(
                    Match.when(true, () => Effect.void),
                    Match.orElse(() =>
                      RuleModule.makeReport(node, `\`${name}\` in a *${c.suffix} is named ${c.expected}. ${see}`)
                    )
                  )
                )
              ),
            { discard: true }
          )
      }
    }
  }),
  "schema-suffix": Rule.define({
    name: "schema-suffix",
    meta: Rule.meta({ type: "problem", description: `Exported Schemas end in Schema. ${see}` }),
    create: function* () {
      const ctx = yield* RuleContext
      const governed = ctx.filename.endsWith(".schema.ts")
      return {
        ExportNamedDeclaration: (node: any) =>
          Effect.forEach(
            Match.value(governed).pipe(
              Match.when(true, () => exportedNames(node)),
              Match.orElse(() => [])
            ),
            ({ name }) =>
              Match.value(name.endsWith("Schema")).pipe(
                Match.when(true, () => Effect.void),
                Match.orElse(() =>
                  RuleModule.makeReport(
                    node,
                    `\`${name}\` is a Schema: name it ${name}Schema, and its type ${name}. ${see}`
                  )
                )
              ),
            { discard: true }
          )
      }
    }
  })
})
