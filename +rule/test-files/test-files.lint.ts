import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../tools/lint/rule-module.make.ts"

const order = ["Arrange", "Act", "Assert"]

const isTestCall = (callee: any): boolean =>
  (callee?.type === "Identifier" && (callee.name === "it" || callee.name === "test")) ||
  (callee?.type === "MemberExpression" && callee.object?.name === "it" && callee.property?.name === "effect")

const span = (node: any): readonly [number, number] => node.range ?? [node.start, node.end]

export default RuleModule.make(import.meta.url, {
  "arrange-act-assert": Rule.define({
    name: "arrange-act-assert",
    meta: Rule.meta({
      type: "problem",
      description: "Tests are // Arrange, // Act, // Assert. See +rule/test-files/test-files.md."
    }),
    create: function* () {
      const ctx = yield* RuleContext
      return {
        CallExpression: (node: any) => {
          const body = node.arguments?.at(-1)
          if (!isTestCall(node.callee) || !/Function/.test(body?.type ?? "")) return Effect.void
          const [start, end] = span(body)
          const marks = ctx.sourceCode
            .getAllComments()
            .filter((c: any) => span(c)[0] >= start && span(c)[1] <= end)
            .map((c: any) => String(c.value).trim())
          return Match.value(marks.join(",") === order.join(",")).pipe(
            Match.when(true, () => Effect.void),
            Match.orElse(() =>
              RuleModule.makeReport(
                node,
                "A test is three steps: // Arrange, // Act, // Assert, in that order. See +rule/test-files/test-files.md."
              )
            )
          )
        }
      }
    }
  })
})
