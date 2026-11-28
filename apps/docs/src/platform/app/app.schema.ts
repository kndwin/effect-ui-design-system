import { UiSchema } from "@effect/ui"
import { Schema } from "effect"
import { ChoicesSchema } from "@weft/components/CustomizeSchema"
import { ModeSchema } from "../theme/theme.schema.ts"
import { AppRoute } from "./app.route.ts"

export const AppPropsSchema = Schema.Struct({ route: AppRoute })

export const AppModelSchema = Schema.Struct({
  route: AppRoute,
  panel: Schema.Boolean,
  choices: ChoicesSchema,
  copied: Schema.Boolean
})
export type AppModel = typeof AppModelSchema.Type

export const AppMessageSchema = UiSchema.TaggedEnum({
  ChangedRoute: { route: AppRoute },
  PressedMode: {},
  ChangedPanel: { open: Schema.Boolean },
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: ModeSchema },
  Chose: { choices: ChoicesSchema },
  ResetChoices: {},
  PressedCopyPage: {},
  CopiedPage: {},
  CopyPageFailed: {},
  ClearedCopiedPage: {}
})

export const GetPageInputSchema = Schema.Struct({ route: AppRoute })
export type GetPageInput = typeof GetPageInputSchema.Type

export const GetPageRouteInputSchema = Schema.Struct({ id: Schema.String, route: AppRoute })
export type GetPageRouteInput = typeof GetPageRouteInputSchema.Type
