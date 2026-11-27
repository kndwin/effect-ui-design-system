import { Match, Record } from "effect"
import type { RecipeRuntime } from "./runtime.pure.ts"

export type CompiledExport =
  | { readonly name: string; readonly value: unknown }
  | {
      readonly name: string
      readonly runtime: Readonly<Record<string, unknown>>
      readonly recipesAt: string | undefined
      readonly recipes: Readonly<Record<string, RecipeRuntime>>
    }

const json = (value: unknown): string => JSON.stringify(value) ?? "undefined"

const expression = (e: CompiledExport): string => {
  if ("value" in e) return json(e.value)
  const classes = `{${Record.collect(e.recipes, (key, r) => `${json(key)}: __recipe(${json(r)})`).join(", ")}}`
  return Match.value(e.recipesAt === undefined).pipe(
    Match.when(true, () => `{ ...${json(e.runtime)}, ...${classes} }`),
    Match.orElse(() => `{ ...${json(e.runtime)}, ${json(e.recipesAt)}: ${classes} }`)
  )
}

export const moduleSource = (
  exports: ReadonlyArray<CompiledExport>,
  imports: { readonly css: string; readonly runtime: string }
): string =>
  [
    `import ${json(imports.css)}`,
    `import { recipe as __recipe } from ${json(imports.runtime)}`,
    ...exports.map((e) => `export const ${e.name} = ${expression(e)}`)
  ].join("\n")
