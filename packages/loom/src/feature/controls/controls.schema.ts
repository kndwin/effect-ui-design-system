import { Schema } from "effect"

export const ControlKindSchema = Schema.Literals(["text", "multiline", "number", "boolean", "json"])
export type ControlKind = typeof ControlKindSchema.Type

export const ControlSchema = Schema.Struct({ name: Schema.String, kind: ControlKindSchema, value: Schema.String })
export type Control = typeof ControlSchema.Type

export const GetControlsInputSchema = Schema.Struct({ args: Schema.String })
export type GetControlsInput = typeof GetControlsInputSchema.Type

export const ComposePatchInputSchema = Schema.Struct({
  name: Schema.String,
  kind: ControlKindSchema,
  value: Schema.String
})
export type ComposePatchInput = typeof ComposePatchInputSchema.Type
