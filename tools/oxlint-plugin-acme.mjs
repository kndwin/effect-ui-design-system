// Local oxlint JS plugin: guardrails for component styles.
// (oxlint has no `no-restricted-syntax`, so the rules live here.)

const RAW_VALUE = /#[0-9a-f]{3,8}\b|(?<![\w-])-?\d*\.?\d+(px|rem|em|ms|s)\b|\b(rgb|rgba|hsl|hsla|oklch)\(/i
const DISABLE = /\b(eslint|oxlint)-disable/

const tokensOnly = {
  meta: {
    type: "problem",
    docs: { description: "Component styles may only use tokens, never raw colours, lengths or durations." },
    messages: {
      raw: "Raw value {{value}}: use a token from ./tokens.ts. Need one that doesn't exist? Stop and ask; don't hard-code a value.",
      disable: "Lint can't be switched off in component styles."
    }
  },
  create(context) {
    const check = (node, text) => {
      const match = typeof text === "string" ? text.match(RAW_VALUE) : null
      if (match) context.report({ node, messageId: "raw", data: { value: JSON.stringify(match[0]) } })
    }
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (DISABLE.test(comment.value)) context.report({ loc: comment.loc, messageId: "disable" })
        }
      },
      Literal: (node) => check(node, node.value),
      TemplateElement: (node) => check(node, node.value.cooked)
    }
  }
}

export default { meta: { name: "acme" }, rules: { "tokens-only": tokensOnly } }
