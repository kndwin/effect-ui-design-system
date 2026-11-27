import { Schema } from "effect"

export const Kind = Schema.Literals(["Color", "Length", "Duration", "Shadow", "Font", "Weight"])
export type Kind = typeof Kind.Type

export const Key = Schema.Union([Schema.String, Schema.Number])
export type Key = typeof Key.Type

export const GetCssVarNameInput = Schema.Struct({ prefix: Schema.String, key: Key })
export type GetCssVarNameInput = typeof GetCssVarNameInput.Type
