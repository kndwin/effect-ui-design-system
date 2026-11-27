import { Schema } from "effect"

export const ExportsSchema = Schema.Record(Schema.String, Schema.String)
export type Exports = typeof ExportsSchema.Type

export const ComponentPackageSchema = Schema.Struct({ exports: ExportsSchema })
export type ComponentPackage = typeof ComponentPackageSchema.Type

export const GetComponentPathInputSchema = Schema.Struct({ exports: ExportsSchema, name: Schema.String })
export type GetComponentPathInput = typeof GetComponentPathInputSchema.Type

export const GetComponentNamesInputSchema = Schema.Struct({ exports: ExportsSchema })
export type GetComponentNamesInput = typeof GetComponentNamesInputSchema.Type

export const MapPathToRecipeFileInputSchema = Schema.Struct({ path: Schema.String })
export type MapPathToRecipeFileInput = typeof MapPathToRecipeFileInputSchema.Type

export const MapSourceToImportsInputSchema = Schema.Struct({ path: Schema.String, source: Schema.String })
export type MapSourceToImportsInput = typeof MapSourceToImportsInputSchema.Type

export const AddOptionsSchema = Schema.Struct({
  names: Schema.Array(Schema.String),
  dir: Schema.String,
  overwrite: Schema.Boolean
})
export type AddOptions = typeof AddOptionsSchema.Type
