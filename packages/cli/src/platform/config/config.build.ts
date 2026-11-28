import { Data, Effect, FileSystem, Match, Option, Path, Schema } from "effect"
import { configFile, defaultThemes, defaultUi } from "./config.constant.ts"
import { ConfigSchema } from "./config.schema.ts"

export class InvalidConfigError extends Data.TaggedError("InvalidConfigError")<{ readonly reason: string }> {
  override get message() {
    return `weft: ${configFile} isn't valid: ${this.reason}`
  }
}

export const loadConfig = Effect.fn("cli/config/loadConfig")(function* (cwd: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const file = path.join(cwd, configFile)
  if (!(yield* fs.exists(file))) return {}
  const text = yield* fs.readFileString(file)
  return yield* Schema.decodeUnknownEffect(Schema.fromJsonString(ConfigSchema))(text).pipe(
    Effect.mapError((error) => new InvalidConfigError({ reason: error.message }))
  )
})

const pick = (flag: Option.Option<string>, configured: string | undefined, fallback: string) =>
  Option.getOrElse(flag, () =>
    Match.value(configured).pipe(
      Match.when(undefined, () => fallback),
      Match.orElse((value) => value)
    )
  )

export const loadPaths = Effect.fn("cli/config/loadPaths")(function* (
  cwd: string,
  flags: { readonly ui: Option.Option<string>; readonly themes: Option.Option<string> }
) {
  const config = yield* loadConfig(cwd)
  return {
    config,
    ui: pick(flags.ui, config.ui, defaultUi),
    themes: pick(flags.themes, config.themes, defaultThemes)
  }
})
