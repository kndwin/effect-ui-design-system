import * as CssEngine from "@acme/css-engine/vite"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { Command, Flag } from "effect/cli"
import { build, createServer, type InlineConfig, preview } from "vite"

const root = import.meta.dirname

const portFlag = Flag.Int("port").pipe(Flag.withDefault(5173))

const config = Effect.gen(function* () {
  const css = yield* CssEngine.loadPlugin({
    include: /\.(component\.style|theme)\.ts$/,
    adapter: "@acme/design-system/Compile"
  })
  return { root, configFile: false, plugins: [css] } satisfies InlineConfig
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
