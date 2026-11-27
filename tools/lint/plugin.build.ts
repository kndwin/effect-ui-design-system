import { fileURLToPath } from "node:url"
import { Plugin } from "effect-oxlint"
import type { RuleModule } from "./define.pure.ts"
import { findRuleFiles } from "./discover.build.ts"
import { inScope, ruleKindOf } from "./kinds.pure.ts"

type AnyRule = { readonly create: (context: { readonly filename: string }) => object }

const scoped = (rule: AnyRule, ruleFile: string): AnyRule => ({
  ...rule,
  create: (context) => (inScope(ruleFile, context.filename) ? rule.create(context) : {})
})

const modules = await Promise.all(
  findRuleFiles("lint.ts").map(async (file) => ({ file, module: (await import(file)).default as RuleModule }))
)

export const ruleIds = modules.flatMap(({ file, module }) =>
  Object.keys(module.rules).map((name) => `${ruleKindOf(file)}/${name}`)
)

export default Plugin.define({
  name: "acme",
  rules: Object.fromEntries(
    modules.flatMap(({ module }) => {
      const file = fileURLToPath(module.url)
      return Object.entries(module.rules).map(([name, rule]) => [
        `${ruleKindOf(file)}/${name}`,
        scoped(rule as unknown as AnyRule, file) as never
      ])
    })
  )
})
