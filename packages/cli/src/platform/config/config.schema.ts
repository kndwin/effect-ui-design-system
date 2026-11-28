import { Schema } from "effect"

export const PackageManagerSchema = Schema.Literals(["pnpm", "npm", "yarn", "bun"])
export type PackageManager = typeof PackageManagerSchema.Type

export const ConfigPathsSchema = Schema.Struct({ ui: Schema.String, themes: Schema.String })
export type ConfigPaths = typeof ConfigPathsSchema.Type

export const ConfigSchema = Schema.Struct({
  paths: ConfigPathsSchema,
  themes: Schema.Array(Schema.Any),
  loom: Schema.Struct({ include: Schema.Array(Schema.String), theme: Schema.optionalKey(Schema.Any) })
})
export type Config = typeof ConfigSchema.Type
