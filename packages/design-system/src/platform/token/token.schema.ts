import { Schema } from "effect"

export const KindSchema = Schema.Literals(["Color", "Length", "Duration", "Shadow", "Font", "Weight"])
export type Kind = typeof KindSchema.Type

export const KeySchema = Schema.Union([Schema.String, Schema.Number])
export type Key = typeof KeySchema.Type

export const MapTokenKeyToCssVarNameInputSchema = Schema.Struct({ prefix: Schema.String, key: KeySchema })
export type MapTokenKeyToCssVarNameInput = typeof MapTokenKeyToCssVarNameInputSchema.Type
