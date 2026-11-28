import { getControls, getCustomThemeSource } from "@weft/components/customize"
import { mapArgumentToChoices } from "@weft/components/customize-map"
import { astryx } from "@weft/theme-astryx"
import { shadcn } from "@weft/theme-shadcn"
import { Array, Data, Effect, Match, Option, Path } from "effect"
import {
  loadComponentsRoot,
  loadExports,
  loadSourceFile,
  runWriteFile,
  runWriteRecipes
} from "../../platform/recipe/recipe.build.ts"
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

export class UnknownChoiceError extends Data.TaggedError("UnknownChoiceError")<{
  readonly choice: string
  readonly available: ReadonlyArray<string>
}> {
  override get message() {
    return `weft: ${this.choice} isn't a choice. Choose from: ${this.available.join(", ")}`
  }
}

const shipped = [shadcn, astryx]

const loadChoices = Effect.fn("cli/theme/loadChoices")(function* (base: string, argument: string) {
  const theme = shipped.find((t) => t.name === base) ?? shadcn
  const choices = mapArgumentToChoices({ argument })
  for (const control of getControls({ themes: shipped, theme })) {
    const chosen = choices[control.id]
    const ids = control.options.map((option) => option.id)
    if (chosen !== null && !ids.includes(chosen))
      return yield* new UnknownChoiceError({ choice: `${control.id}=${chosen}`, available: ids })
  }
  return { theme, choices }
})

export const runTheme = Effect.fn("cli/theme/runTheme")(function* (options: ThemeOptions) {
  const path = yield* Path.Path
  if (!Array.contains(baseThemes, options.base)) return yield* new UnknownThemeError({ base: options.base })
  if (!/^[a-z][a-z0-9-]*$/.test(options.name)) return yield* new InvalidThemeNameError({ name: options.name })
  const custom = yield* Option.match(options.choices, {
    onNone: () => Effect.succeed(Option.none()),
    onSome: (argument) => Effect.map(loadChoices(options.base, argument), Option.some)
  })
  const root = yield* loadComponentsRoot()
  const contract = Option.fromNullishOr((yield* loadExports(root))["./tokens"])
  yield* runWriteRecipes(
    root,
    Option.match(contract, { onNone: () => [], onSome: (file) => [file.replace(/^\.\//, "")] }),
    { dir: options.ui, overwrite: false }
  )
  const target = path.join(options.dir, `${options.name}.theme.ts`)
  const relative = path.relative(path.dirname(target), path.join(options.ui, "tokens.ts"))
  const tokensImport = Match.value(relative.startsWith(".")).pipe(
    Match.when(true, () => relative),
    Match.orElse(() => `./${relative}`)
  )
  const source = yield* Option.match(custom, {
    onNone: () =>
      Effect.map(loadSourceFile(`@weft/theme-${options.base}`), (base) =>
        mapThemeToRecipeSource({ source: base, base: options.base, name: options.name, tokensImport })
      ),
    onSome: ({ theme, choices }) =>
      Effect.succeed(getCustomThemeSource({ choices, themes: shipped, theme, name: options.name, tokensImport }))
  })
  return yield* runWriteFile(target, source, options.overwrite)
})
