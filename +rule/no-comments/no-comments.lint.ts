import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../tools/lint/define.pure.ts"

const typeAssertion = /^\s*@ts-expect-error\b/
const arrangeActAssert = /^ (Arrange|Act|Assert)$/

const allowed = (filename: string) => (comment: { value: string }) =>
  typeAssertion.test(comment.value) || (filename.endsWith(".test.ts") && arrangeActAssert.test(comment.value))

export default rules(import.meta.url, {
  "any-comment": Rule.define({
    name: "any-comment",
    meta: Rule.meta({ type: "problem", description: "No comments in source. See +rule/no-comments/no-comments.md." }),
    create: function* () {
      const ctx = yield* RuleContext
      const ok = allowed(ctx.filename)
      return {
        Program: (node: unknown) =>
          Effect.forEach(
            ctx.sourceCode.getAllComments().filter((c: { value: string }) => !ok(c)),
            () =>
              report(
                node,
                "No comments: name things clearly, or write it in a rule .md. See +rule/no-comments/no-comments.md."
              ),
            { discard: true }
          )
      }
    }
  })
})
