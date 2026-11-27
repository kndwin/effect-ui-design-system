import { existsSync } from "node:fs"
import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../tools/lint/define.pure.ts"

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

export default rules(import.meta.url, {
  tested: Rule.define({
    name: "tested",
    meta: Rule.meta({ type: "problem", description: "Every *.pure.ts has a *.pure.test.ts. See +rule/pure/pure.md." }),
    create: function* () {
      const ctx = yield* RuleContext
      const missing =
        ctx.filename.endsWith(".pure.ts") && !existsSync(ctx.filename.replace(/\.pure\.ts$/, ".pure.test.ts"))
      return {
        Program: (node: unknown) =>
          missing ? report(node, "Add a *.pure.test.ts next to this file. See +rule/pure/pure.md.") : Effect.void
      }
    }
  }),
  effects: Rule.define({
    name: "effects",
    meta: Rule.meta({ type: "problem", description: "Data files have no side effects. See +rule/pure/pure.md." }),
    create: function* () {
      yield* RuleContext
      return {
        Identifier: (node: any) =>
          !isPropertyName(node) && ambient.has(node.name ?? "")
            ? report(node, `\`${node.name}\` is an ambient effect. See +rule/pure/pure.md.`)
            : Effect.void,
        MemberExpression: (node: any) =>
          (node.object?.name === "Math" && node.property?.name === "random") ||
          (node.object?.name === "Date" && node.property?.name === "now")
            ? report(
                node,
                `\`${node.object?.name}.${node.property?.name}\` is non-deterministic. See +rule/pure/pure.md.`
              )
            : Effect.void,
        NewExpression: (node: any) =>
          node.callee?.name === "Date"
            ? report(node, "`new Date()` is non-deterministic. See +rule/pure/pure.md.")
            : Effect.void,
        VariableDeclaration: (node: any) =>
          atTopLevel(node) && node.kind !== "const"
            ? report(node, `Top-level \`${node.kind}\` is module state: use const. See +rule/pure/pure.md.`)
            : Effect.void,
        ExpressionStatement: (node: any) =>
          node.parent?.type === "Program" && !node.directive
            ? report(node, "Top-level statements run on import. See +rule/pure/pure.md.")
            : Effect.void
      }
    }
  })
})
