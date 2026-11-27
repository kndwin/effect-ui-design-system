import { UiSchema } from "@effect/ui"
import { Schema } from "effect"
import { ChoicesSchema } from "../../feature/theme-builder/theme-builder.schema.ts"
import { ModeSchema } from "../theme/theme.schema.ts"
import { AppRoute } from "./app.route.ts"

export const AppPropsSchema = Schema.Struct({ route: AppRoute })

export const AppModelSchema = Schema.Struct({ route: AppRoute, panel: Schema.Boolean, choices: ChoicesSchema })
export type AppModel = typeof AppModelSchema.Type

export const AppMessageSchema = UiSchema.TaggedEnum({
  ChangedRoute: { route: AppRoute },
  PressedMode: {},
  PressedPanel: {},
  PickedTheme: { theme: Schema.String },
  PickedMode: { mode: ModeSchema },
  Chose: { choices: ChoicesSchema },
  ResetChoices: {}
})

export const GetPageInputSchema = Schema.Struct({ route: AppRoute })
export type GetPageInput = typeof GetPageInputSchema.Type

export const GetPageRouteInputSchema = Schema.Struct({ id: Schema.String, route: AppRoute })
export type GetPageRouteInput = typeof GetPageRouteInputSchema.Type
