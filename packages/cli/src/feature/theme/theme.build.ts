import { fileURLToPath } from "node:url"
import { Array, Data, Effect, FileSystem, Match, Option, Path } from "effect"
import { loadComponentsRoot, loadExports, runWriteFile, runWriteRecipes } from "../../platform/recipe/recipe.build.ts"
import { baseThemes } from "./theme.constant.ts"
import { mapThemeToRecipeSource } from "./theme.pure.map.ts"
import type { ThemeOptions } from "./theme.schema.ts"

export class UnknownThemeError extends Data.TaggedError("UnknownThemeError")<{ readonly base: string }> {
  override get message() {
    return `weft: no theme named ${this.base}. Start from one of: ${baseThemes.join(", ")}`
  }
}

export class InvalidThemeNameError extends Data.TaggedError("InvalidThemeNameError")<{ readonly name: string }> {
  override get message() {
    return `weft: "${this.name}" isn't a theme name. Use lowercase letters, digits and dashes, starting with a letter.`
  }
}

export const runTheme = Effect.fn("cli/theme/runTheme")(function* (options: ThemeOptions) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  if (!Array.contains(baseThemes, options.base)) return yield* new UnknownThemeError({ base: options.base })
  if (!/^[a-z][a-z0-9-]*$/.test(options.name)) return yield* new InvalidThemeNameError({ name: options.name })
  const root = yield* loadComponentsRoot()
  const contract = Option.fromNullishOr((yield* loadExports(root))["./tokens"])
  yield* runWriteRecipes(
    root,
    Option.match(contract, { onNone: () => [], onSome: (file) => [file.replace(/^\.\//, "")] }),
    { dir: options.ui, overwrite: false }
  )
  const source = yield* fs.readFileString(fileURLToPath(import.meta.resolve(`@weft/theme-${options.base}`)))
  const target = path.join(options.dir, `${options.name}.theme.ts`)
  const relative = path.relative(path.dirname(target), path.join(options.ui, "tokens.ts"))
  const tokensImport = Match.value(relative.startsWith(".")).pipe(
    Match.when(true, () => relative),
    Match.orElse(() => `./${relative}`)
  )
  return yield* runWriteFile(
    target,
    mapThemeToRecipeSource({ source, base: options.base, name: options.name, tokensImport }),
    options.overwrite
  )
})
