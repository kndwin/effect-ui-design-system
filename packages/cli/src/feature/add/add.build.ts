import { Array, Console, Data, Effect, Option } from "effect"
import { loadComponentsRoot, loadExports, runWriteRecipes } from "../../platform/recipe/recipe.build.ts"
import { getComponentNames, getComponentPath } from "./add.pure.ts"
import type { AddOptions } from "./add.schema.ts"

export class UnknownComponentError extends Data.TaggedError("UnknownComponentError")<{
  readonly names: ReadonlyArray<string>
  readonly available: ReadonlyArray<string>
}> {
  override get message() {
    return `weft: no component named ${this.names.join(", ")}. Available: ${this.available.join(", ")}`
  }
}

export const runAdd = Effect.fn("cli/add/runAdd")(function* (options: AddOptions) {
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
  return yield* runWriteRecipes(root, Array.getSomes(Array.map(found, (entry) => entry.path)), options)
})
