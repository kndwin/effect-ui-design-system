import { Schema } from "effect"

export const CompileOptionsSchema = Schema.Struct({
  adapter: Schema.String,
  scope: Schema.String,
  debug: Schema.Boolean,
  cssImport: Schema.String,
  runtimeImport: Schema.String
})
export type CompileOptions = typeof CompileOptionsSchema.Type

export const CompiledFileSchema = Schema.Struct({ css: Schema.String, code: Schema.String })
export type CompiledFile = typeof CompiledFileSchema.Type
