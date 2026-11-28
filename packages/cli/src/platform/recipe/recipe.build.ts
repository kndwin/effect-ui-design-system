import { fileURLToPath } from "node:url"
import { Console, Effect, FileSystem, HashSet, Path, Record, Schema } from "effect"
import {
  mapPathToRecipeFile,
  mapPathToSourcePath,
  mapSourceToImports,
  mapSourceToRecipeSource
} from "./recipe.pure.map.ts"
import { ComponentPackageSchema, type WriteRecipeOptions } from "./recipe.schema.ts"

export const loadPackageRoot = Effect.fn("cli/recipe/loadPackageRoot")(function* (file: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  let dir = path.dirname(file)
  while (!(yield* fs.exists(path.join(dir, "package.json"))) && path.dirname(dir) !== dir) dir = path.dirname(dir)
  return dir
})

export const loadComponentsRoot = Effect.fn("cli/recipe/loadComponentsRoot")(function* () {
  return yield* loadPackageRoot(fileURLToPath(import.meta.resolve("@weft/components/tokens")))
})

export const loadSourceFile = Effect.fn("cli/recipe/loadSourceFile")(function* (specifier: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const file = fileURLToPath(import.meta.resolve(specifier))
  const root = yield* loadPackageRoot(file)
  return yield* fs.readFileString(path.join(root, mapPathToSourcePath({ path: path.relative(root, file) })))
})

export const loadExports = Effect.fn("cli/recipe/loadExports")(function* (root: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const text = yield* fs.readFileString(path.join(root, "package.json"))
  const { exports } = yield* Schema.decodeUnknownEffect(Schema.fromJsonString(ComponentPackageSchema))(text)
  return Record.map(exports, (file) => `./${mapPathToSourcePath({ path: file.replace(/^\.\//, "") })}`)
})

export const scanRecipeFiles = Effect.fn("cli/recipe/scanRecipeFiles")(function* (
  root: string,
  entries: ReadonlyArray<string>
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const sources = new Map<string, string>()
  const queue = [...entries]
  while (queue.length > 0) {
    const file = queue.shift() ?? ""
    if (sources.has(file)) continue
    const source = yield* fs.readFileString(path.join(root, file))
    sources.set(file, source)
    queue.push(...mapSourceToImports({ path: file, source }))
  }
  return sources
})

export const runWriteFile = Effect.fn("cli/recipe/runWriteFile")(function* (
  target: string,
  content: string,
  overwrite: boolean
) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  yield* fs.makeDirectory(path.dirname(target), { recursive: true })
  if ((yield* fs.exists(target)) && !overwrite) {
    yield* Console.log(`  kept    ${target}`)
    return false
  }
  yield* fs.writeFileString(target, content)
  yield* Console.log(`  added   ${target}`)
  return true
})

export const runWriteRecipes = Effect.fn("cli/recipe/runWriteRecipes")(function* (
  root: string,
  entries: ReadonlyArray<string>,
  options: WriteRecipeOptions
) {
  const path = yield* Path.Path
  const sources = yield* scanRecipeFiles(root, entries)
  const written: Array<string> = []
  const seen = HashSet.empty<string>()
  for (const [file, source] of sources) {
    const target = mapPathToRecipeFile({ path: file })
    if (HashSet.has(seen, target)) continue
    const wrote = yield* runWriteFile(
      path.join(options.dir, target),
      mapSourceToRecipeSource({ path: file, source }),
      options.overwrite
    )
    if (wrote) written.push(target)
  }
  return written
})
