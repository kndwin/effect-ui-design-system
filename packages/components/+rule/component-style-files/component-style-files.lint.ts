import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import * as RuleModule from "../../../../tools/lint/rule-module.make.ts"

const raw = /#[0-9a-f]{3,8}\b|(?<![\w-])-?\d*\.?\d+(px|rem|em|ms|s)\b|\b(rgb|rgba|hsl|hsla|oklch)\(/i

const check = (node: unknown, text: unknown) => {
  const found = Match.value(text).pipe(
    Match.when(Match.string, (s) => s.match(raw)),
    Match.orElse(() => null)
  )
  return Match.value(found).pipe(
    Match.when(null, () => Effect.void),
    Match.orElse((m) =>
      RuleModule.report(
        node,
        `Raw value ${JSON.stringify(m[0])}: use a token. See +rule/component-style-files/component-style-files.md.`
      )
    )
  )
}

export default RuleModule.make(import.meta.url, {
  "tokens-only": Rule.define({
    name: "tokens-only",
    meta: Rule.meta({
      type: "problem",
      description: "Style values are tokens. See +rule/component-style-files/component-style-files.md."
    }),
    create: function* () {
      yield* RuleContext
      return {
        Literal: (node: any) => check(node, node.value),
        TemplateElement: (node: any) => check(node, node.value?.cooked)
      }
    }
  })
})
