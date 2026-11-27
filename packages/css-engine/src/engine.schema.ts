import { Schema } from "effect"

export const CompileOptions = Schema.Struct({
  adapter: Schema.String,
  scope: Schema.String,
  debug: Schema.Boolean,
  cssImport: Schema.String,
  runtimeImport: Schema.String
})
export type CompileOptions = typeof CompileOptions.Type

export const CompiledFile = Schema.Struct({ css: Schema.String, code: Schema.String })
export type CompiledFile = typeof CompiledFile.Type
