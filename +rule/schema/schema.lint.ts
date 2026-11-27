import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../tools/lint/define.pure.ts"

const schemaRoots = new Set(["Schema", "UiSchema"])

const rootOf = (node: any): string | undefined => {
  if (node?.type === "Identifier") return node.name
  if (node?.type === "MemberExpression") return rootOf(node.object)
  if (node?.type === "CallExpression") return rootOf(node.callee)
  if (node?.type === "TSAsExpression" || node?.type === "TSSatisfiesExpression") return rootOf(node.expression)
  return undefined
}

const allowedImport = (source: string) =>
  source === "effect" || source === "@effect/ui" || (source.startsWith(".") && source.endsWith(".schema.ts"))

export default rules(import.meta.url, {
  "only-schemas": Rule.define({
    name: "only-schemas",
    meta: Rule.meta({
      type: "problem",
      description: "A *.schema.ts exports only Schemas and their types. See +rule/schema/schema.md."
    }),
    create: function* () {
      yield* RuleContext
      return {
        ExportNamedDeclaration: (node: any) => {
          const d = node.declaration
          if (d === null || d === undefined || d.type.startsWith("TS")) return Effect.void
          const ok =
            d.type === "VariableDeclaration" &&
            d.declarations.every((v: any) => v.init?.type === "CallExpression" && schemaRoots.has(rootOf(v.init) ?? ""))
          return ok
            ? Effect.void
            : report(node, "Export only Schemas, built with Schema.* or UiSchema.*. See +rule/schema/schema.md.")
        }
      }
    }
  }),
  imports: Rule.define({
    name: "imports",
    meta: Rule.meta({
      type: "problem",
      description: "A *.schema.ts imports only effect, @effect/ui and other schemas. See +rule/schema/schema.md."
    }),
    create: function* () {
      yield* RuleContext
      return {
        ImportDeclaration: (node: any) =>
          allowedImport(String(node.source?.value ?? ""))
            ? Effect.void
            : report(node, "Import only from effect, @effect/ui or another *.schema.ts. See +rule/schema/schema.md.")
      }
    }
  })
})
