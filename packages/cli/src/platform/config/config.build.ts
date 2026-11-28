import { pathToFileURL } from "node:url"
import { Data, Effect, FileSystem, Option, Path, Schema } from "effect"
import { configFile } from "./config.constant.ts"
import { ConfigSchema } from "./config.schema.ts"
import { make } from "./weft-config.make.ts"

export class InvalidConfigError extends Data.TaggedError("InvalidConfigError")<{ readonly reason: string }> {
  override get message() {
    return `weft: ${configFile} isn't valid: ${this.reason}`
  }
}

const decodeConfig = Schema.decodeUnknownEffect(ConfigSchema)

export const loadConfig = Effect.fn("cli/config/loadConfig")(function* (cwd: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const file = path.join(cwd, configFile)
  if (!(yield* fs.exists(file))) return make()
  const module = yield* Effect.tryPromise({
    try: () => import(pathToFileURL(file).href) as Promise<{ readonly default?: unknown }>,
    catch: (error) => new InvalidConfigError({ reason: String(error) })
  })
  const config = yield* decodeConfig(make((module.default ?? {}) as Parameters<typeof make>[0])).pipe(
    Effect.mapError((error) => new InvalidConfigError({ reason: error.message }))
  )
  return config
})

export const loadPaths = Effect.fn("cli/config/loadPaths")(function* (
  cwd: string,
  flags: { readonly ui: Option.Option<string>; readonly themes: Option.Option<string> }
) {
  const config = yield* loadConfig(cwd)
  return {
    config,
    ui: Option.getOrElse(flags.ui, () => config.paths.ui),
    themes: Option.getOrElse(flags.themes, () => config.paths.themes)
  }
})
