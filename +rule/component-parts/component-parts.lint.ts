import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/src/platform/rule-module/rule-module.make.ts"

const isCommandConstructor = (callee: any) =>
  callee?.type === "MemberExpression" &&
  callee.object?.name === "Command" &&
  (callee.property?.name === "make" || callee.property?.name === "Service")

export default RuleModule.make(import.meta.url, {
  "commands-in-command-files": Rule.define({
    name: "commands-in-command-files",
    meta: Rule.meta({
      type: "problem",
      description: "Commands are defined only in *.command.ts. See +rule/component-parts/component-parts.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      const isCommandFile = ctx.filename.endsWith(".command.ts")
      return {
        CallExpression: (node: any) =>
          Match.value(!isCommandFile && isCommandConstructor(node.callee)).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(
                node,
                "Define Commands in a *.command.ts: effects run only there. See +rule/component-parts/component-parts.md."
              )
            ),
            Match.orElse(() => Effect.void)
          )
      }
    }
  })
})
