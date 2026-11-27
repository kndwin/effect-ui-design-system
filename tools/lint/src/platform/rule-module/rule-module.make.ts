import * as Effect from "effect/Effect"
import { Diagnostic, type Rule, RuleContext } from "effect-oxlint"

export interface RuleModule {
  readonly url: string
  readonly rules: Readonly<Record<string, ReturnType<typeof Rule.define>>>
}

export const make = (url: string, defined: RuleModule["rules"]): RuleModule => ({ url, rules: defined })

export const makeReport = (node: unknown, message: string) =>
  Effect.gen(function* () {
    const ctx = yield* RuleContext
    yield* ctx.report(Diagnostic.make({ node: node as never, message }))
  })
