import { fileURLToPath } from "node:url"
import { BunServices } from "@effect/platform-bun"
import { Array, Effect, Match, Record } from "effect"
import { Plugin } from "effect-oxlint"
import type { RuleModule } from "../../platform/rule-module/rule-module.make.ts"
import { scanRuleFiles } from "../../platform/discover/discover.build.ts"
import { isInScope } from "../../platform/kind/kinds.pure.predicate.ts"
import { mapRuleFileToRuleKind } from "../../platform/kind/kinds.pure.map.ts"

type AnyRule = { readonly create: (context: { readonly filename: string }) => object }

const scoped = (rule: AnyRule, ruleFile: string): AnyRule => ({
  ...rule,
  create: (context) =>
    Match.value(isInScope({ ruleFile: ruleFile, file: context.filename })).pipe(
      Match.when(true, () => rule.create(context)),
      Match.orElse(() => ({}))
    )
})

const load = Effect.gen(function* () {
  const files = yield* scanRuleFiles("lint.ts")
  return yield* Effect.forEach(files, (file) =>
    Effect.promise(() => import(file)).pipe(Effect.map((m) => ({ file, module: m.default as RuleModule })))
  )
})

const modules = await Effect.runPromise(load.pipe(Effect.provide(BunServices.layer)))

const entries = Array.flatMap(modules, ({ module }) => {
  const file = fileURLToPath(module.url)
  return Record.collect(
    module.rules,
    (name, rule) =>
      [`${mapRuleFileToRuleKind({ ruleFile: file })}/${name}`, scoped(rule as unknown as AnyRule, file)] as const
  )
})

export const ruleIds = Array.map(entries, ([id]) => id)

export default Plugin.define({ name: "acme", rules: Record.fromEntries(entries) as never })
