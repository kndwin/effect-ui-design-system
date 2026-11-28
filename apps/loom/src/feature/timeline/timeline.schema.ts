import { Schema } from "effect"

export const ClipSchema = Schema.Struct({
  seq: Schema.Number,
  at: Schema.Number,
  tag: Schema.String,
  payload: Schema.String,
  model: Schema.String,
  args: Schema.String
})
export type Clip = typeof ClipSchema.Type

export const ClipsInputSchema = Schema.Struct({ clips: Schema.Array(ClipSchema) })
export type ClipsInput = typeof ClipsInputSchema.Type

export const ClipsAtInputSchema = Schema.Struct({ clips: Schema.Array(ClipSchema), at: Schema.Number })
export type ClipsAtInput = typeof ClipsAtInputSchema.Type

export const StepDirectionSchema = Schema.Literals(["start", "back", "forward", "end"])
export type StepDirection = typeof StepDirectionSchema.Type

export const GetSteppedAtInputSchema = Schema.Struct({
  clips: Schema.Array(ClipSchema),
  at: Schema.NullOr(Schema.Number),
  direction: StepDirectionSchema
})
export type GetSteppedAtInput = typeof GetSteppedAtInputSchema.Type

export const GetPlayheadInputSchema = Schema.Struct({
  clips: Schema.Array(ClipSchema),
  at: Schema.NullOr(Schema.Number)
})
export type GetPlayheadInput = typeof GetPlayheadInputSchema.Type

export const TickSchema = Schema.Struct({ at: Schema.Number, major: Schema.Boolean })
export type Tick = typeof TickSchema.Type

export const DurationInputSchema = Schema.Struct({ duration: Schema.Number })
export type DurationInput = typeof DurationInputSchema.Type

export const MapMessageToLabelInputSchema = Schema.Struct({ message: Schema.Unknown })
export type MapMessageToLabelInput = typeof MapMessageToLabelInputSchema.Type

export const LabelSchema = Schema.Struct({ tag: Schema.String, payload: Schema.String })
export type Label = typeof LabelSchema.Type

export const MapTimeToLabelInputSchema = Schema.Struct({ at: Schema.Number })
export type MapTimeToLabelInput = typeof MapTimeToLabelInputSchema.Type
