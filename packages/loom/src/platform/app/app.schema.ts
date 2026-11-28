import { UiSchema } from "@effect/ui"
import { Schema } from "effect"
import { ControlKindSchema } from "../../feature/controls/controls.schema.ts"
import { ClipSchema, StepDirectionSchema } from "../../feature/timeline/timeline.schema.ts"

export const LoomEntrySchema = Schema.Struct({ title: Schema.String, scenarios: Schema.Array(Schema.String) })
export type LoomEntry = typeof LoomEntrySchema.Type

export const ModeSchema = Schema.Literals(["light", "dark"])
export type Mode = typeof ModeSchema.Type

export const SelectedSchema = Schema.Struct({ title: Schema.String, scenario: Schema.String })
export type Selected = typeof SelectedSchema.Type

export const ThemeEntrySchema = Schema.Struct({ name: Schema.String, modes: Schema.Array(Schema.String) })
export type ThemeEntry = typeof ThemeEntrySchema.Type

export const EditSchema = Schema.Struct({ count: Schema.Number, patch: Schema.String })

export const AppPropsSchema = Schema.Struct({
  looms: Schema.Array(LoomEntrySchema),
  themes: Schema.Array(ThemeEntrySchema),
  theme: Schema.String
})

export const AppModelSchema = Schema.Struct({
  selected: SelectedSchema,
  run: Schema.Number,
  clips: Schema.Array(ClipSchema),
  at: Schema.NullOr(Schema.Number),
  mode: ModeSchema,
  theme: Schema.String,
  args: Schema.String,
  edit: EditSchema
})
export type AppModel = typeof AppModelSchema.Type

export const AppMessageSchema = UiSchema.TaggedEnum({
  PressedScenario: { selected: SelectedSchema },
  PressedRun: {},
  PressedStep: { direction: StepDirectionSchema },
  Scrubbed: { at: Schema.Number },
  PressedMode: {},
  PressedTheme: { theme: Schema.String },
  EditedArg: { name: Schema.String, kind: ControlKindSchema, value: Schema.String },
  Recorded: { clips: Schema.Array(ClipSchema), args: Schema.String }
})
