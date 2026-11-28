import * as CssEngine from "@weft/css-engine/vite"
import * as LoomVite from "@weft/loom/vite"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Effect, FileSystem, Layer, Match, Path, String } from "effect"
import { Command, Flag } from "effect/cli"
import { ChildProcess, ChildProcessSpawner } from "effect/process"
import { build, createServer, type InlineConfig, type Plugin, preview, type ViteDevServer } from "vite"

const root = import.meta.dirname

const portFlag = Flag.Int("port").pipe(Flag.withDefault(5173))

interface MarkdownModule {
  readonly getMarkdownFiles: (input: {
    readonly pages: ReadonlyArray<unknown>
  }) => ReadonlyArray<{ readonly path: string; readonly content: string }>
}

interface ContentModule {
  readonly pages: ReadonlyArray<unknown>
}

const loadMarkdownFiles = (server: ViteDevServer) =>
  Effect.tryPromise(async () => {
    const markdown = (await server.ssrLoadModule("/src/platform/markdown/markdown.pure.ts")) as MarkdownModule
    const content = (await server.ssrLoadModule("/src/platform/content/content.constant.ts")) as ContentModule
    return markdown.getMarkdownFiles({ pages: content.pages })
  })

const markdownPlugin: Plugin = {
  name: "weft-docs-markdown",
  configureServer: (server) => {
    server.middlewares.use((req, res, next) => {
      const path = (req.url ?? "").split("?")[0] ?? ""
      if (!/\.(md|txt)$/.test(path)) return next()
      Effect.runPromise(loadMarkdownFiles(server)).then(
        (files) => {
          const file = files.find((f) => f.path === path)
          if (file === undefined) return next()
          res.setHeader(
            "content-type",
            Match.value(path.endsWith(".md")).pipe(
              Match.when(true, () => "text/markdown; charset=utf-8"),
              Match.orElse(() => "text/plain; charset=utf-8")
            )
          )
          res.end(file.content)
        },
        (error: unknown) => next(error)
      )
    })
  }
}

const loadRelease = Effect.gen(function* () {
  const spawner = yield* ChildProcessSpawner.ChildProcessSpawner
  const commit = yield* spawner.string(ChildProcess.make("git", ["rev-parse", "HEAD"], { cwd: root }))
  return String.trim(commit).slice(0, 7)
}).pipe(Effect.orElseSucceed(() => "main"))

const config = Effect.gen(function* () {
  const css = yield* CssEngine.loadPlugin({
    include: /\.(component\.style|theme)\.ts$/,
    adapter: "@weft/design-system/Compile"
  })
  const release = yield* loadRelease
  return {
    root,
    configFile: false,
    define: { "import.meta.env.VITE_WEFT_RELEASE": JSON.stringify(release) },
    plugins: [css, markdownPlugin, LoomVite.makePlugin()]
  } satisfies InlineConfig
})

const writeMarkdownFiles = Effect.fn("docs/writeMarkdownFiles")(function* (inline: InlineConfig) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const server = yield* Effect.acquireRelease(
    Effect.tryPromise(() =>
      createServer({ ...inline, appType: "custom", server: { middlewareMode: true, hmr: false, ws: false } })
    ),
    (s) => Effect.promise(() => s.close())
  )
  const files = yield* loadMarkdownFiles(server)
  for (const file of files) {
    const target = path.join(root, "dist", file.path)
    yield* fs.makeDirectory(path.dirname(target), { recursive: true })
    yield* fs.writeFileString(target, file.content)
  }
  yield* Effect.log(`wrote ${files.length} Markdown files`)
})

const serve = <S extends { close(): Promise<void>; printUrls(): void }>(start: () => Promise<S>) =>
  Effect.gen(function* () {
    const server = yield* Effect.acquireRelease(Effect.tryPromise(start), (s) => Effect.promise(() => s.close()))
    server.printUrls()
    return yield* Effect.never
  })

const dev = Command.make("dev", { port: portFlag }, ({ port }) =>
  Effect.gen(function* () {
    const inline = yield* config
    return yield* serve(async () => (await createServer({ ...inline, server: { port, strictPort: true } })).listen())
  })
)

const bundle = Command.make("build", {}, () =>
  Effect.gen(function* () {
    const inline = yield* config
    yield* Effect.tryPromise(() => build(inline))
    yield* Effect.scoped(writeMarkdownFiles(inline))
  })
)

const previewCommand = Command.make("preview", { port: portFlag }, ({ port }) =>
  serve(() => preview({ root, configFile: false, preview: { port, strictPort: true } }))
)

const docs = Command.make("docs").pipe(Command.withSubcommands([dev, bundle, previewCommand]))

Command.run(docs, { version: "0.0.0" }).pipe(
  Effect.scoped,
  Effect.provide(Layer.merge(CssEngine.makeLayer(root), BunServices.layer)),
  BunRuntime.runMain
)
