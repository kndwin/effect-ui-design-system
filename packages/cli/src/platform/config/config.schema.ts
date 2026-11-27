import { Schema } from "effect"

export const PackageManagerSchema = Schema.Literals(["pnpm", "npm", "yarn", "bun"])
export type PackageManager = typeof PackageManagerSchema.Type

export const ConfigSchema = Schema.Struct({
  $schema: Schema.optionalKey(Schema.String),
  ui: Schema.optionalKey(Schema.String),
  themes: Schema.optionalKey(Schema.String),
  packageManager: Schema.optionalKey(PackageManagerSchema)
})
export type Config = typeof ConfigSchema.Type
