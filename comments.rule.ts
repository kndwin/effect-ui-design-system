import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "./tools/lint/define.pure.ts"

const allowedComment = /^\s*@ts-expect-error\b/

export default rules(import.meta.url, {
  none: Rule.define({
    name: "none",
    meta: Rule.meta({ type: "problem", description: "No comments in source. See comments.rule.md." }),
    create: function* () {
      const ctx = yield* RuleContext
      return {
        Program: (node: unknown) =>
          Effect.forEach(
            ctx.sourceCode.getAllComments().filter((c: { value: string }) => !allowedComment.test(c.value)),
            () => report(node, "No comments: name things clearly, or write it in a *.rule.md. See comments.rule.md."),
            { discard: true }
          )
      }
    }
  })
})
