import { fileURLToPath } from "node:url"
import { NodeServices } from "@effect/platform-node"
import { Array, Effect, Record } from "effect"
import { Plugin } from "effect-oxlint"
import type { RuleModule } from "./define.pure.ts"
import { findRuleFiles } from "./discover.build.ts"
import { inScope, ruleKindOf } from "./kinds.pure.ts"

type AnyRule = { readonly create: (context: { readonly filename: string }) => object }

const scoped = (rule: AnyRule, ruleFile: string): AnyRule => ({
  ...rule,
  create: (context) => (inScope(ruleFile, context.filename) ? rule.create(context) : {})
})

const load = Effect.gen(function* () {
  const files = yield* findRuleFiles("lint.ts")
  return yield* Effect.forEach(files, (file) =>
    Effect.promise(() => import(file)).pipe(Effect.map((m) => ({ file, module: m.default as RuleModule })))
  )
})

const modules = await Effect.runPromise(load.pipe(Effect.provide(NodeServices.layer)))

const entries = Array.flatMap(modules, ({ module }) => {
  const file = fileURLToPath(module.url)
  return Record.collect(
    module.rules,
    (name, rule) => [`${ruleKindOf(file)}/${name}`, scoped(rule as unknown as AnyRule, file)] as const
  )
})

export const ruleIds = Array.map(entries, ([id]) => id)

export default Plugin.define({ name: "acme", rules: Record.fromEntries(entries) as never })
