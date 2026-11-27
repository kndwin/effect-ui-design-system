import * as Effect from "effect/Effect"
import { Rule, RuleContext } from "effect-oxlint"
import { report, rules } from "../../../../tools/lint/define.pure.ts"

const raw = /#[0-9a-f]{3,8}\b|(?<![\w-])-?\d*\.?\d+(px|rem|em|ms|s)\b|\b(rgb|rgba|hsl|hsla|oklch)\(/i

const check = (node: unknown, text: unknown) => {
  const match = typeof text === "string" ? text.match(raw) : null
  return match
    ? report(node, `Raw value ${JSON.stringify(match[0])}: use a token. See +rule/component.style/component.style.md.`)
    : Effect.void
}

export default rules(import.meta.url, {
  "tokens-only": Rule.define({
    name: "tokens-only",
    meta: Rule.meta({
      type: "problem",
      description: "Style values are tokens. See +rule/component.style/component.style.md."
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
