import { UiSchema } from "@effect/ui"
import { Schema } from "effect"
import { ClipSchema, StepDirectionSchema } from "../../feature/timeline/timeline.schema.ts"

export const LoomEntrySchema = Schema.Struct({ title: Schema.String, scenarios: Schema.Array(Schema.String) })
export type LoomEntry = typeof LoomEntrySchema.Type

export const ModeSchema = Schema.Literals(["light", "dark"])
export type Mode = typeof ModeSchema.Type

export const SelectedSchema = Schema.Struct({ title: Schema.String, scenario: Schema.String })
export type Selected = typeof SelectedSchema.Type

export const AppPropsSchema = Schema.Struct({ looms: Schema.Array(LoomEntrySchema), theme: Schema.String })

export const AppModelSchema = Schema.Struct({
  selected: SelectedSchema,
  run: Schema.Number,
  clips: Schema.Array(ClipSchema),
  at: Schema.NullOr(Schema.Number),
  mode: ModeSchema
})
export type AppModel = typeof AppModelSchema.Type

export const AppMessageSchema = UiSchema.TaggedEnum({
  PressedScenario: { selected: SelectedSchema },
  PressedRun: {},
  PressedStep: { direction: StepDirectionSchema },
  Scrubbed: { at: Schema.Number },
  PressedMode: {},
  Recorded: { clips: Schema.Array(ClipSchema) }
})
