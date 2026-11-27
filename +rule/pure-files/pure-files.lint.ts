import { existsSync } from "node:fs"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"

const ambient = new Set([
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
  "fetch",
  "console",
  "process",
  "globalThis"
])

const isPropertyName = (node: any): boolean => {
  const p = node.parent
  return (
    (p?.type === "MemberExpression" && p.property === node && !p.computed) ||
    (p?.type === "Property" && p.key === node && !p.computed) ||
    p?.type === "TSPropertySignature" ||
    (p?.type?.startsWith("Import") ?? false) ||
    (p?.type?.startsWith("Export") ?? false)
  )
}

const atTopLevel = (node: any) => node.parent?.type === "Program" || node.parent?.parent?.type === "Program"

const isFunction = (node: any) => node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression"

const isSchemaModule = (source: string) => source.endsWith(".schema.ts") || /^@[\w-]+\/[\w-]+\/\w*Schema$/.test(source)

const schemaImports = (program: any): ReadonlySet<string> =>
  new Set(
    (program.body ?? [])
      .filter((n: any) => n.type === "ImportDeclaration" && isSchemaModule(String(n.source?.value ?? "")))
      .flatMap((n: any) => n.specifiers.map((sp: any) => sp.local?.name as string))
  )

const exportedFunctions = (node: any): ReadonlyArray<{ readonly name: string; readonly fn: any }> =>
  Match.value(node.declaration?.type).pipe(
    Match.when("VariableDeclaration", () =>
      node.declaration.declarations
        .filter((v: any) => isFunction(v.init))
        .map((v: any) => ({ name: v.id?.name ?? "", fn: v.init }))
    ),
    Match.when("FunctionDeclaration", () => [{ name: node.declaration.id?.name ?? "", fn: node.declaration }]),
    Match.orElse(() => [])
  )

const typeName = (param: any): string | undefined => {
  const annotation = param?.typeAnnotation?.typeAnnotation
  return Match.value(annotation?.type).pipe(
    Match.when("TSTypeReference", () => annotation.typeName?.name ?? annotation.typeName?.left?.name),
    Match.orElse(() => undefined)
  )
}

const exportedIn = (filename: string, node: any) =>
  Match.value(/\.pure(\.map|\.predicate)?\.ts$/.test(filename)).pipe(
    Match.when(true, () => exportedFunctions(node)),
    Match.orElse(() => [])
  )

export default RuleModule.make(import.meta.url, {
  "object-input": Rule.define({
    name: "object-input",
    meta: Rule.meta({
      type: "problem",
      description: "An exported pure function takes one object parameter. See +rule/pure-files/pure-files.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      return {
        ExportNamedDeclaration: (node: any) =>
          Effect.forEach(
            exportedIn(ctx.filename, node),
            ({ name, fn }) =>
              Match.value(fn.params.length === 1 && fn.params[0].type === "ObjectPattern").pipe(
                Match.when(true, () => Effect.void),
                Match.orElse(() =>
                  RuleModule.makeReport(
                    fn,
                    `\`${name}\` takes one object parameter: ${name}({ … }). See +rule/pure-files/pure-files.md.`
                  )
                )
              ),
            { discard: true }
          )
      }
    }
  }),
  "schema-input": Rule.define({
    name: "schema-input",
    meta: Rule.meta({
      type: "problem",
      description:
        "An exported pure function's input type comes from a *.schema.ts. See +rule/pure-files/pure-files.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      let fromSchema: ReadonlySet<string> = new Set()
      return {
        Program: (node: any) =>
          Effect.sync(() => {
            fromSchema = schemaImports(node)
          }),
        ExportNamedDeclaration: (node: any) =>
          Effect.forEach(
            exportedIn(ctx.filename, node),
            ({ name, fn }) =>
              Match.value(fn.typeParameters !== undefined && fn.typeParameters !== null).pipe(
                Match.when(true, () => Effect.void),
                Match.orElse(() =>
                  Match.value(fromSchema.has(typeName(fn.params[0]) ?? "")).pipe(
                    Match.when(true, () => Effect.void),
                    Match.orElse(() =>
                      RuleModule.makeReport(
                        fn,
                        `\`${name}\`'s input type is a Schema type imported from a *.schema.ts. See +rule/pure-files/pure-files.md.`
                      )
                    )
                  )
                )
              ),
            { discard: true }
          )
      }
    }
  }),
  functions: Rule.define({
    name: "functions",
    meta: Rule.meta({
      type: "problem",
      description: "A *.pure.ts exports only functions and types. See +rule/pure-files/pure-files.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const governed = /\.pure(\.map|\.predicate)?\.ts$/.test(ctx.filename)
      const message =
        "A *.pure.ts exports only functions: constants go in a *.constant.ts and Schemas in a *.schema.ts. See +rule/pure-files/pure-files.md."
      return {
        ExportNamedDeclaration: (node: any) => {
          const d = node.declaration
          if (!governed || d === null || d === undefined) return Effect.void
          if (d.type === "ClassDeclaration") return RuleModule.makeReport(node, message)
          if (d.type !== "VariableDeclaration") return Effect.void
          return Match.value(d.declarations.every((v: any) => isFunction(v.init))).pipe(
            Match.when(true, () => Effect.void),
            Match.orElse(() => RuleModule.makeReport(node, message))
          )
        }
      }
    }
  }),
  tested: Rule.define({
    name: "tested",
    meta: Rule.meta({
      type: "problem",
      description: "Every *.pure.ts has a *.pure.test.ts. See +rule/pure-files/pure-files.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const missing =
        /\.pure(\.map|\.predicate)?\.ts$/.test(ctx.filename) && !existsSync(ctx.filename.replace(/\.ts$/, ".test.ts"))
      return {
        Program: (node: unknown) =>
          Match.value(missing).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(
                node,
                "Add a colocated test next to this file (x.pure.ts → x.pure.test.ts, x.pure.map.ts → x.pure.map.test.ts). See +rule/pure-files/pure-files.md."
              )
            ),
            Match.orElse(() => Effect.void)
          )
      }
    }
  }),
  effects: Rule.define({
    name: "effects",
    meta: Rule.meta({
      type: "problem",
      description: "Data files have no side effects. See +rule/pure-files/pure-files.md."
    }),
    create: function* () {
      yield* RuleContext
      return {
        Identifier: (node: any) =>
          Match.value(!isPropertyName(node) && ambient.has(node.name ?? "")).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(node, `\`${node.name}\` is an ambient effect. See +rule/pure-files/pure-files.md.`)
            ),
            Match.orElse(() => Effect.void)
          ),
        MemberExpression: (node: any) =>
          Match.value(
            (node.object?.name === "Math" && node.property?.name === "random") ||
              (node.object?.name === "Date" && node.property?.name === "now")
          ).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(
                node,
                `\`${node.object?.name}.${node.property?.name}\` is non-deterministic. See +rule/pure-files/pure-files.md.`
              )
            ),
            Match.orElse(() => Effect.void)
          ),
        NewExpression: (node: any) =>
          Match.value(node.callee?.name === "Date").pipe(
            Match.when(true, () =>
              RuleModule.makeReport(node, "`new Date()` is non-deterministic. See +rule/pure-files/pure-files.md.")
            ),
            Match.orElse(() => Effect.void)
          ),
        VariableDeclaration: (node: any) =>
          Match.value(atTopLevel(node) && node.kind !== "const").pipe(
            Match.when(true, () =>
              RuleModule.makeReport(
                node,
                `Top-level \`${node.kind}\` is module state: use const. See +rule/pure-files/pure-files.md.`
              )
            ),
            Match.orElse(() => Effect.void)
          ),
        ExpressionStatement: (node: any) =>
          Match.value(node.parent?.type === "Program" && !node.directive).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(node, "Top-level statements run on import. See +rule/pure-files/pure-files.md.")
            ),
            Match.orElse(() => Effect.void)
          )
      }
    }
  })
})
