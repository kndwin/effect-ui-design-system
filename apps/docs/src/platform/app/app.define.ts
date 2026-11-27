import { Html } from "@effect/ui/html"
import { AppMessageSchema, AppModelSchema, AppPropsSchema } from "./app.schema.ts"

export const AppDef = Html.component({
  name: "App",
  props: AppPropsSchema,
  model: AppModelSchema,
  message: AppMessageSchema
})
