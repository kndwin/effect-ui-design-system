import { dirname, resolve } from "node:path"
import * as Effect from "effect/Effect"
import * as Match from "effect/Match"
import { Rule, RuleContext } from "effect-oxlint"
import { mapPathToPosixPath } from "../../tools/lint/src/platform/kind/kinds.pure.map.ts"
import * as RuleModule from "../../tools/lint/src/platform/rule-module/rule-module.make.ts"

const see = "See +rule/feature-folders/feature-folders.md."

const sourceRoot = /^(.*\/(?:packages\/(?!themes\/)[^/]+|apps\/[^/]+|tools\/[^/]+)\/src)\/(.*)$/

const layout = /^(main\.ts|(feature|platform)\/[a-z0-9]+(-[a-z0-9]+)*\/.+)$/

const featureOf = (path: string): string | undefined =>
  mapPathToPosixPath({ path }).match(/\/src\/feature\/([^/]+)\//)?.[1]

const srcOf = (path: string): string | undefined => mapPathToPosixPath({ path }).match(sourceRoot)?.[1]

export default RuleModule.make(import.meta.url, {
  layout: Rule.define({
    name: "layout",
    meta: Rule.meta({ type: "problem", description: `src/ holds feature/<name>/ and platform/<name>/. ${see}` }),
    create: function* () {
      const ctx = yield* RuleContext
      const within = mapPathToPosixPath({ path: ctx.filename }).match(sourceRoot)?.[2]
      return {
        Program: (node: unknown) =>
          Match.value(within === undefined || layout.test(within)).pipe(
            Match.when(true, () => Effect.void),
            Match.orElse(() =>
              RuleModule.makeReport(
                node,
                `Move this into src/feature/<name>/ or src/platform/<name>/ (or src/main.ts for an app). ${see}`
              )
            )
          )
      }
    }
  }),
  "no-cross-feature-imports": Rule.define({
    name: "no-cross-feature-imports",
    meta: Rule.meta({ type: "problem", description: `A feature never imports another feature. ${see}` }),
    create: function* () {
      const ctx = yield* RuleContext
      const own = featureOf(ctx.filename)
      const src = srcOf(ctx.filename)
      return {
        ImportDeclaration: (node: any) => {
          const source = String(node.source?.value ?? "")
          const target = Match.value(source.startsWith(".")).pipe(
            Match.when(true, () => mapPathToPosixPath({ path: resolve(dirname(ctx.filename), source) })),
            Match.orElse(() => "")
          )
          const other = featureOf(target)
          return Match.value(own !== undefined && other !== undefined && other !== own && srcOf(target) === src).pipe(
            Match.when(true, () =>
              RuleModule.makeReport(
                node,
                `feature/${own} imports feature/${other}. Move what they share into platform/, or let platform/ compose them. ${see}`
              )
            ),
            Match.orElse(() => Effect.void)
          )
        }
      }
    }
  })
})
