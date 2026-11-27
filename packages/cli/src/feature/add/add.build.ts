import { fileURLToPath } from "node:url"
import { Array, Console, Data, Effect, FileSystem, HashSet, Option, Path, Schema } from "effect"
import { getComponentNames, getComponentPath } from "./add.pure.ts"
import { mapPathToRecipeFile, mapSourceToImports, mapSourceToRecipeSource } from "./add.pure.map.ts"
import { type AddOptions, ComponentPackageSchema } from "./add.schema.ts"

export class UnknownComponentError extends Data.TaggedError("UnknownComponentError")<{
  readonly names: ReadonlyArray<string>
  readonly available: ReadonlyArray<string>
}> {
  override get message() {
    return `weft: no component named ${this.names.join(", ")}. Available: ${this.available.join(", ")}`
  }
}

export const loadComponentsRoot = Effect.fn("cli/add/loadComponentsRoot")(function* () {
  const path = yield* Path.Path
  const tokens = fileURLToPath(import.meta.resolve("@weft/components/tokens"))
  return path.resolve(path.dirname(tokens), "..", "..", "..")
})

export const loadExports = Effect.fn("cli/add/loadExports")(function* (root: string) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const text = yield* fs.readFileString(path.join(root, "package.json"))
  return (yield* Schema.decodeUnknownEffect(Schema.fromJsonString(ComponentPackageSchema))(text)).exports
})

export const scanRecipeFiles = Effect.fn("cli/add/scanRecipeFiles")(function* (
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

export const runAdd = Effect.fn("cli/add/runAdd")(function* (options: AddOptions) {
  const fs = yield* FileSystem.FileSystem
  const path = yield* Path.Path
  const root = yield* loadComponentsRoot()
  const exports = yield* loadExports(root)
  const available = getComponentNames({ exports })
  if (options.names.length === 0) {
    yield* Console.log(`Components: ${available.join(", ")}`)
    return []
  }
  const found = Array.map(options.names, (name) => ({ name, path: getComponentPath({ exports, name }) }))
  const unknown = Array.filter(found, (entry) => Option.isNone(entry.path))
  if (unknown.length > 0) {
    return yield* new UnknownComponentError({ names: Array.map(unknown, (entry) => entry.name), available })
  }
  const sources = yield* scanRecipeFiles(root, Array.getSomes(Array.map(found, (entry) => entry.path)))
  yield* fs.makeDirectory(options.dir, { recursive: true })
  const existing = HashSet.fromIterable(yield* fs.readDirectory(options.dir))
  const written: Array<string> = []
  for (const [file, source] of sources) {
    const target = mapPathToRecipeFile({ path: file })
    if (HashSet.has(existing, target) && !options.overwrite) {
      yield* Console.log(`  kept    ${path.join(options.dir, target)}`)
      continue
    }
    yield* fs.writeFileString(path.join(options.dir, target), mapSourceToRecipeSource({ path: file, source }))
    yield* Console.log(`  added   ${path.join(options.dir, target)}`)
    written.push(target)
  }
  return written
})
