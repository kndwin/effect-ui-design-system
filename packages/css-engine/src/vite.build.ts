import { existsSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { Cause, Context, Data, Effect, Exit, Layer, ManagedRuntime, MutableHashMap, Option } from "effect"
import { createServer, isRunnableDevEnvironment, type Plugin, type RunnableDevEnvironment } from "vite"
import { compileFile, EvaluationError, ModuleLoader } from "./engine.build.ts"

export interface Options {
  readonly include: RegExp
  readonly adapter: string
}

export class RunnerError extends Data.TaggedError("RunnerError")<{ readonly cause: unknown }> {
  override get message() {
    return `css-engine: the ssr environment can't run modules: ${this.cause instanceof Error ? this.cause.message : String(this.cause)}`
  }
}

const CSS = ".acme.css"
const runtimeImport = fileURLToPath(new URL("./runtime.pure.ts", import.meta.url))

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
      return env && isRunnableDevEnvironment(env)
        ? Effect.succeed(env)
        : Effect.fail(new RunnerError({ cause: "no runnable ssr environment" }))
    })
  )

const loaderOf = (env: RunnableDevEnvironment) =>
  ModuleLoader.of({
    load: (id, importer) =>
      Effect.tryPromise({
        try: async () => {
          const resolved = importer ? ((await env.pluginContainer.resolveId(id, importer))?.id ?? id) : id
          return (await env.runner.import(resolved)) as Record<string, unknown>
        },
        catch: (cause) => new EvaluationError({ file: id, cause })
      })
  })

const dependenciesOf = (env: RunnableDevEnvironment, file: string): ReadonlyArray<string> => {
  const seen = new Set<string>()
  const visit = (id: string | null | undefined) => {
    const node = id ? env.moduleGraph.getModuleById(id) : undefined
    if (!node?.file || seen.has(node.file) || node.file.includes("node_modules")) return
    seen.add(node.file)
    for (const child of node.importedModules) visit(child.id)
  }
  visit(file)
  return [...seen]
}

export class SsrEnvironment extends Context.Service<SsrEnvironment, RunnableDevEnvironment>()(
  "@acme/css-engine/SsrEnvironment"
) {}

const layerOf = (root: string) => {
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
  return existsSync(absolute) ? absolute : join(root, absolute)
}

const failure = (cause: Cause.Cause<unknown>) => {
  const error = Cause.squash(cause)
  return error instanceof Error ? error.message : String(error)
}

export const cssEngine = (options: Options): Plugin => {
  let root = process.cwd()
  let isBuild = false
  let runtime: ManagedRuntime.ManagedRuntime<SsrEnvironment | ModuleLoader, RunnerError> | undefined
  const sheets = MutableHashMap.empty<string, string>()
  const dependents = MutableHashMap.empty<string, ReadonlySet<string>>()

  const run = <A, E>(effect: Effect.Effect<A, E, SsrEnvironment | ModuleLoader>) =>
    (runtime ??= ManagedRuntime.make(layerOf(root))).runPromiseExit(effect)

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
    },
    resolveId: (source) => (source.endsWith(CSS) ? source : null),
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
      return Exit.isSuccess(exit) ? { code: exit.value.code, map: null } : this.error(failure(exit.cause))
    },
    async handleHotUpdate({ file, server, modules }) {
      const styles = MutableHashMap.get(dependents, file)
      if (Option.isNone(styles) || !runtime) return
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
      const closing = runtime
      runtime = undefined
      await closing?.dispose()
    }
  }
}
