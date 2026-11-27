import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../tools/lint/define.pure.ts"

const isFunction = (node: any) => node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression"

export default rules(import.meta.url, {
  "no-functions": Rule.define({
    name: "no-functions",
    meta: Rule.meta({
      type: "problem",
      description: "A *.constant.ts exports values and types, no functions. See +rule/constant/constant.md."
    }),
    create: function* () {
      yield* RuleContext
      const message =
        "A *.constant.ts exports values, not functions: move this to a *.pure.ts. See +rule/constant/constant.md."
      return {
        ExportNamedDeclaration: (node: any) => {
          const d = node.declaration
          if (d === null || d === undefined) return Effect.void
          if (d.type === "FunctionDeclaration" || d.type === "ClassDeclaration") return report(node, message)
          if (d.type !== "VariableDeclaration") return Effect.void
          return d.declarations.some((v: any) => isFunction(v.init)) ? report(node, message) : Effect.void
        }
      }
    }
  })
})
