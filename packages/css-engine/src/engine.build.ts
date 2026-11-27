import { Array, Context, Data, Effect, Record } from "effect"
import { type CompiledExport, moduleSource } from "./codegen.pure.ts"
import { globalRules } from "./css.pure.ts"
import { compileRecipe } from "./recipe.pure.ts"
import { type Adapter, isAdapter, type Output } from "./rules.pure.ts"

export class EvaluationError extends Data.TaggedError("EvaluationError")<{
  readonly file: string
  readonly cause: unknown
}> {
  override get message() {
    return `css-engine: couldn't evaluate ${this.file}: ${this.cause instanceof Error ? this.cause.message : String(this.cause)}`
  }
}

export class AdapterError extends Data.TaggedError("AdapterError")<{
  readonly adapter: string
  readonly exportName: string
  readonly cause: unknown
}> {
  override get message() {
    const reason = this.cause instanceof Error ? this.cause.message : String(this.cause)
    return `css-engine: adapter ${this.adapter} failed on ${this.exportName}: ${reason}`
  }
}

export class ModuleLoader extends Context.Service<
  ModuleLoader,
  {
    readonly load: (id: string, importer?: string) => Effect.Effect<Readonly<Record<string, unknown>>, EvaluationError>
  }
>()("@acme/css-engine/ModuleLoader") {}

export interface CompileOptions {
  readonly adapter: string
  readonly scope: string
  readonly debug: boolean
  readonly cssImport: string
  readonly runtimeImport: string
}

export interface CompiledFile {
  readonly css: string
  readonly code: string
}

const adapterOf = (options: CompileOptions, file: string) =>
  Effect.gen(function* () {
    const loader = yield* ModuleLoader
    const mod = yield* loader.load(options.adapter, file)
    return isAdapter(mod.compile)
      ? mod.compile
      : yield* new AdapterError({
          adapter: options.adapter,
          exportName: "compile",
          cause: "it has no `compile` export"
        })
  })

const run = (compile: Adapter, options: CompileOptions, name: string, value: unknown) =>
  Effect.try({
    try: () => compile(value, name),
    catch: (cause) => new AdapterError({ adapter: options.adapter, exportName: name, cause })
  })

const lower = (name: string, value: unknown, out: Output | undefined, options: CompileOptions) => {
  if (out === undefined) return { css: [], exported: { name, value } satisfies CompiledExport }
  const globals = (out.globals ?? []).flatMap(globalRules)
  if (out.recipes === undefined)
    return { css: globals, exported: { name, value: out.runtime } satisfies CompiledExport }
  const compiled = Record.map(out.recipes, (r) => compileRecipe(r, options.scope, options.debug))
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

export const compileFile = Effect.fn("css-engine/compileFile")(function* (file: string, options: CompileOptions) {
  const loader = yield* ModuleLoader
  const mod = yield* loader.load(file)
  const compile = yield* adapterOf(options, file)
  const lowered = yield* Effect.forEach(Record.toEntries(mod), ([name, value]) =>
    run(compile, options, name, value).pipe(Effect.map((out) => lower(name, value, out, options)))
  )
  return {
    css: Array.flatMap(lowered, (l) => l.css).join("\n"),
    code: moduleSource(
      Array.map(lowered, (l) => l.exported),
      { css: options.cssImport, runtime: options.runtimeImport }
    )
  } satisfies CompiledFile
})
