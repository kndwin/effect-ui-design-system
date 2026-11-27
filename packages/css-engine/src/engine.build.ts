import { Array, Context, Data, Effect, Record } from "effect"
import { mapExportsToModuleSource } from "./codegen.pure.map.ts"
import type { CompiledExport } from "./codegen.schema.ts"
import { mapGlobalRuleToCssRules } from "./css.pure.map.ts"
import { mapRecipeToCompiledRecipe } from "./recipe.pure.map.ts"
import { mapCauseToMessage } from "./message.pure.map.ts"
import { type Adapter, isAdapter } from "./rules.pure.predicate.ts"
import type { Output } from "./rules.schema.ts"
import type { CompiledFile, CompileOptions } from "./engine.schema.ts"

export class EvaluationError extends Data.TaggedError("EvaluationError")<{
  readonly file: string
  readonly cause: unknown
}> {
  override get message() {
    return `css-engine: couldn't evaluate ${this.file}: ${mapCauseToMessage({ cause: this.cause })}`
  }
}

export class AdapterError extends Data.TaggedError("AdapterError")<{
  readonly adapter: string
  readonly exportName: string
  readonly cause: unknown
}> {
  override get message() {
    const reason = mapCauseToMessage({ cause: this.cause })
    return `css-engine: adapter ${this.adapter} failed on ${this.exportName}: ${reason}`
  }
}

export class ModuleLoader extends Context.Service<
  ModuleLoader,
  {
    readonly load: (id: string, importer?: string) => Effect.Effect<Readonly<Record<string, unknown>>, EvaluationError>
  }
>()("@acme/css-engine/ModuleLoader") {}

const adapterOf = Effect.fn("css-engine/adapterOf")(function* (options: CompileOptions, file: string) {
  const loader = yield* ModuleLoader
  const mod = yield* loader.load(options.adapter, file)
  if (isAdapter({ value: mod.composeOutput })) return mod.composeOutput as Adapter
  return yield* new AdapterError({
    adapter: options.adapter,
    exportName: "composeOutput",
    cause: "it has no `composeOutput` export"
  })
})

const getLowered = (name: string, value: unknown, out: Output | undefined, options: CompileOptions) => {
  if (out === undefined) return { css: [], exported: { name, value } satisfies CompiledExport }
  const globals = (out.globals ?? []).flatMap((rule) => mapGlobalRuleToCssRules({ rule }))
  if (out.recipes === undefined)
    return { css: globals, exported: { name, value: out.runtime } satisfies CompiledExport }
  const compiled = Record.map(out.recipes, (recipe) =>
    mapRecipeToCompiledRecipe({ recipe, scope: options.scope, debug: options.debug })
  )
  return {
    css: [...globals, ...Array.flatten(Record.collect(compiled, (_, c) => c.css))],
    exported: {
      name,
      runtime: out.runtime,
      recipesAt: out.recipesAt,
      recipes: Record.map(compiled, (c) => c.runtime)
    } satisfies CompiledExport
  }
}

const compileExport = Effect.fn("css-engine/compileExport")(function* (
  compile: Adapter,
  options: CompileOptions,
  name: string,
  value: unknown
) {
  const out = yield* Effect.try({
    try: () => compile({ value, exportName: name }),
    catch: (cause) => new AdapterError({ adapter: options.adapter, exportName: name, cause })
  })
  return getLowered(name, value, out, options)
})

export const compileFile = Effect.fn("css-engine/compileFile")(function* (file: string, options: CompileOptions) {
  const loader = yield* ModuleLoader
  const mod = yield* loader.load(file)
  const compile = yield* adapterOf(options, file)
  const lowered = yield* Effect.forEach(Record.toEntries(mod), ([name, value]) =>
    compileExport(compile, options, name, value)
  )
  return {
    css: Array.flatMap(lowered, (l) => l.css).join("\n"),
    code: mapExportsToModuleSource({
      exports: Array.map(lowered, (l) => l.exported),
      imports: { css: options.cssImport, runtime: options.runtimeImport }
    })
  } satisfies CompiledFile
})
