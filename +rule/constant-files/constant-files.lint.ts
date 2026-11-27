import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"

const isFunction = (node: any) => node?.type === "ArrowFunctionExpression" || node?.type === "FunctionExpression"

export default RuleModule.make(import.meta.url, {
  "no-functions": Rule.define({
    name: "no-functions",
    meta: Rule.meta({
      type: "problem",
      description: "A *.constant.ts exports values and types, no functions. See +rule/constant-files/constant-files.md."
    }),
    create: function* () {
      yield* RuleContext
      const message =
        "A *.constant.ts exports values, not functions: move this to a *.pure.ts. See +rule/constant-files/constant-files.md."
      return {
        ExportNamedDeclaration: (node: any) => {
          const d = node.declaration
          if (d === null || d === undefined) return Effect.void
          if (d.type === "FunctionDeclaration" || d.type === "ClassDeclaration")
            return RuleModule.makeReport(node, message)
          if (d.type !== "VariableDeclaration") return Effect.void
          return Match.value(d.declarations.some((v: any) => isFunction(v.init))).pipe(
            Match.when(true, () => RuleModule.makeReport(node, message)),
            Match.orElse(() => Effect.void)
          )
        }
      }
    }
  })
})
