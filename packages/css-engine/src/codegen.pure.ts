import { Match, Record } from "effect"
import type { CompiledExport, GetModuleSourceInput } from "./codegen.schema.ts"

const getJson = (value: unknown): string => JSON.stringify(value) ?? "undefined"

const getExportExpression = (e: CompiledExport): string => {
  if ("value" in e) return getJson(e.value)
  const classes = `{${Record.collect(e.recipes, (key, r) => `${getJson(key)}: __recipe({ runtime: ${getJson(r)} })`).join(", ")}}`
  return Match.value(e.recipesAt === undefined).pipe(
    Match.when(true, () => `{ ...${getJson(e.runtime)}, ...${classes} }`),
    Match.orElse(() => `{ ...${getJson(e.runtime)}, ${getJson(e.recipesAt)}: ${classes} }`)
  )
}

export const getModuleSource = ({ exports, imports }: GetModuleSourceInput): string =>
  [
    `import ${getJson(imports.css)}`,
    `import { composeRecipe as __recipe } from ${getJson(imports.runtime)}`,
    ...exports.map((e) => `export const ${e.name} = ${getExportExpression(e)}`)
  ].join("\n")
