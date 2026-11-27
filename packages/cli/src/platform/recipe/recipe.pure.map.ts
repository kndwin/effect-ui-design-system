import { Array, Match } from "effect"
import type { MapPathToRecipeFileInput, MapSourceToImportsInput } from "./recipe.schema.ts"

const relativeImport = /(from\s+)"(\.{1,2}\/[^"]+)"/g

const mapSegmentsToPath = (segments: ReadonlyArray<string>) =>
  Array.reduce(segments, [] as ReadonlyArray<string>, (resolved, segment) =>
    Match.value(segment).pipe(
      Match.when(".", () => resolved),
      Match.when("..", () => resolved.slice(0, -1)),
      Match.orElse((name) => [...resolved, name])
    )
  ).join("/")

const mapImportToPath = (path: string, specifier: string) =>
  mapSegmentsToPath([...path.split("/").slice(0, -1), ...specifier.split("/")])

export const mapPathToRecipeFile = ({ path }: MapPathToRecipeFileInput): string => {
  const file = path.split("/").at(-1) ?? path
  return Match.value(file).pipe(
    Match.when("contract.token.ts", () => "tokens.ts"),
    Match.when("scales.schema.ts", () => "scales.ts"),
    Match.when(
      (name: string) => name.endsWith(".component.ts"),
      (name) => name.replace(/\.component\.ts$/, ".ts")
    ),
    Match.orElse((name) => name)
  )
}

export const mapSourceToImports = ({ path, source }: MapSourceToImportsInput): ReadonlyArray<string> =>
  Array.map([...source.matchAll(relativeImport)], (match) => mapImportToPath(path, match[2] ?? ""))

export const mapSourceToRecipeSource = ({ path, source }: MapSourceToImportsInput): string =>
  source.replaceAll(
    relativeImport,
    (_match, keyword: string, specifier: string) =>
      `${keyword}"./${mapPathToRecipeFile({ path: mapImportToPath(path, specifier) })}"`
  )
