import * as CssEngine from "@weft/css-engine/vite"
import { BunRuntime, BunServices } from "@effect/platform-bun"
import { Effect, Layer } from "effect"
import { Command, Flag } from "effect/cli"
import { createServer, type InlineConfig } from "vite"

const root = import.meta.dirname

const portFlag = Flag.Int("port").pipe(Flag.withDefault(5174))

const config = Effect.gen(function* () {
  const css = yield* CssEngine.loadPlugin({
    include: /\.(component\.style|theme)\.ts$/,
    adapter: "@weft/design-system/Compile"
  })
  return { root, configFile: false, plugins: [css] } satisfies InlineConfig
})

const dev = Command.make("dev", { port: portFlag }, ({ port }) =>
  Effect.gen(function* () {
    const inline = yield* config
    const server = yield* Effect.acquireRelease(
      Effect.tryPromise(async () => (await createServer({ ...inline, server: { port, strictPort: true } })).listen()),
      (s) => Effect.promise(() => s.close())
    )
    server.printUrls()
    return yield* Effect.never
  })
)

const loom = Command.make("loom").pipe(Command.withSubcommands([dev]))

Command.run(loom, { version: "0.0.0" }).pipe(
  Effect.scoped,
  Effect.provide(Layer.merge(CssEngine.makeLayer(root), BunServices.layer)),
  BunRuntime.runMain
)
