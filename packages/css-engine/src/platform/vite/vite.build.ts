import { existsSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { Cause, Context, Data, Effect, Exit, Layer, ManagedRuntime, Match, MutableHashMap, Option } from "effect"
import { createServer, isRunnableDevEnvironment, type Plugin, type RunnableDevEnvironment } from "vite"
import { compileFile, EvaluationError, ModuleLoader } from "../engine/engine.build.ts"
import { mapCauseToMessage } from "../message/message.pure.map.ts"
import type { Options } from "./vite.schema.ts"

export class RunnerError extends Data.TaggedError("RunnerError")<{ readonly cause: unknown }> {
  override get message() {
    return `css-engine: the ssr environment can't run modules: ${mapCauseToMessage({ cause: this.cause })}`
  }
}

const CSS = ".weft.css"
const runtimeImport = fileURLToPath(new URL("../../feature/recipe/runtime.pure.ts", import.meta.url))

const runnerOf = (root: string) =>
  Effect.acquireRelease(
    Effect.tryPromise({
      try: () =>
        createServer({
          root,
          configFile: false,
          logLevel: "silent",
          appType: "custom",
          server: { middlewareMode: true, hmr: false, watch: null },
          optimizeDeps: { noDiscovery: true, include: [] }
        }),
      catch: (cause) => new RunnerError({ cause })
    }),
    (server) => Effect.promise(() => server.close())
  ).pipe(
    Effect.flatMap((server) => {
      const env = server.environments.ssr
      if (env && isRunnableDevEnvironment(env)) return Effect.succeed(env)
      return Effect.fail(new RunnerError({ cause: "no runnable ssr environment" }))
    })
  )

const loaderOf = (env: RunnableDevEnvironment) =>
  ModuleLoader.of({
    load: (id, importer) =>
      Effect.tryPromise({
        try: async () => {
          const found = await Match.value(importer).pipe(
            Match.when(undefined, () => Promise.resolve(null)),
            Match.orElse((from) => env.pluginContainer.resolveId(id, from))
          )
          const resolved = found?.id ?? id
          return (await env.runner.import(resolved)) as Record<string, unknown>
        },
        catch: (cause) => new EvaluationError({ file: id, cause })
      })
  })

const dependenciesOf = (env: RunnableDevEnvironment, file: string): ReadonlyArray<string> => {
  const seen = new Set<string>()
  const visit = (id: string | null | undefined) => {
    const node = Match.value(id).pipe(
      Match.when(Match.nonEmptyString, (known) => env.moduleGraph.getModuleById(known)),
      Match.orElse(() => undefined)
    )
    if (!node?.file || seen.has(node.file) || node.file.includes("node_modules")) return
    seen.add(node.file)
    for (const child of node.importedModules) visit(child.id)
  }
  visit(file)
  return [...seen]
}

export class SsrEnvironment extends Context.Service<SsrEnvironment, RunnableDevEnvironment>()(
  "@weft/css-engine/SsrEnvironment"
) {}

export const makeLayer = (root: string) => {
  const ssr = Layer.effect(SsrEnvironment, runnerOf(root))
  const loader = Layer.effect(
    ModuleLoader,
    Effect.gen(function* () {
      return loaderOf(yield* SsrEnvironment)
    })
  )
  return Layer.provideMerge(loader, ssr)
}

const cssPath = (root: string, id: string) => {
  const absolute = id.slice(0, -CSS.length)
  return Match.value(existsSync(absolute)).pipe(
    Match.when(true, () => absolute),
    Match.orElse(() => join(root, absolute))
  )
}

const failure = (cause: Cause.Cause<unknown>) => mapCauseToMessage({ cause: Cause.squash(cause) })

type Services = SsrEnvironment | ModuleLoader

interface Host {
  readonly run: <A, E>(effect: Effect.Effect<A, E, Services>) => Promise<Exit.Exit<A, E | RunnerError>>
  readonly started: () => boolean
  readonly configure: (root: string) => void
  readonly dispose: () => Promise<void>
}

const pluginOf = (options: Options, host: Host): Plugin => {
  let root = process.cwd()
  let isBuild = false
  const sheets = MutableHashMap.empty<string, string>()
  const dependents = MutableHashMap.empty<string, ReadonlySet<string>>()

  const run = host.run

  const compile = Effect.fn("css-engine/vite/compile")(function* (file: string) {
    const result = yield* compileFile(file, {
      adapter: options.adapter,
      scope: relative(root, file),
      debug: !isBuild,
      cssImport: file + CSS,
      runtimeImport
    })
    MutableHashMap.set(sheets, file, result.css)
    const env = yield* SsrEnvironment
    for (const dep of dependenciesOf(env, file)) {
      const current = Option.getOrElse(MutableHashMap.get(dependents, dep), () => new Set<string>())
      MutableHashMap.set(dependents, dep, new Set([...current, file]))
    }
    return result
  })

  const invalidate = Effect.gen(function* () {
    const env = yield* SsrEnvironment
    env.moduleGraph.invalidateAll()
    env.runner.clearCache()
  })

  return {
    name: "css-engine",
    enforce: "pre",
    configResolved(config) {
      root = config.root
      isBuild = config.command === "build"
      host.configure(root)
    },
    resolveId: (source) =>
      Match.value(source.endsWith(CSS)).pipe(
        Match.when(true, () => source),
        Match.orElse(() => null)
      ),
    async load(id) {
      if (!id.endsWith(CSS)) return null
      const file = cssPath(root, id)
      if (!MutableHashMap.has(sheets, file)) {
        const exit = await run(compile(file))
        if (Exit.isFailure(exit)) return this.error(failure(exit.cause))
      }
      return Option.getOrElse(MutableHashMap.get(sheets, file), () => "")
    },
    async transform(_code, id) {
      if (id.includes("?") || !options.include.test(id)) return null
      const exit = await run(compile(id))
      return Exit.match(exit, {
        onSuccess: (compiled) => ({ code: compiled.code, map: null }),
        onFailure: (cause) => this.error(failure(cause))
      })
    },
    async handleHotUpdate({ file, server, modules }) {
      const styles = MutableHashMap.get(dependents, file)
      if (Option.isNone(styles) || !host.started()) return
      await run(invalidate)
      const affected = new Set(modules)
      for (const style of styles.value) {
        for (const id of [style, style + CSS]) {
          const mod = server.moduleGraph.getModuleById(id)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            affected.add(mod)
          }
        }
      }
      return [...affected]
    },
    async buildEnd() {
      await host.dispose()
    }
  }
}

export const makePlugin = (options: Options): Plugin => {
  let root = process.cwd()
  let runtime: ManagedRuntime.ManagedRuntime<Services, RunnerError> | undefined
  return pluginOf(options, {
    run: (effect) => (runtime ??= ManagedRuntime.make(makeLayer(root))).runPromiseExit(effect),
    started: () => runtime !== undefined,
    configure: (next) => {
      root = next
    },
    dispose: async () => {
      const closing = runtime
      runtime = undefined
      await closing?.dispose()
    }
  })
}

export const loadPlugin = Effect.fn("css-engine/vite/loadPlugin")(function* (options: Options) {
  const context = yield* Effect.context<Services>()
  const run = Effect.runPromiseExitWith(context)
  return pluginOf(options, {
    run: (effect) => run(effect),
    started: () => true,
    configure: () => undefined,
    dispose: () => Promise.resolve()
  })
})
