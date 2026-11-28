import { Html } from "@effect/ui/html"
import { AppMessageSchema, AppModelSchema, AppPropsSchema } from "./app.schema.ts"

export const AppDef = Html.component({
  name: "LoomApp",
  props: AppPropsSchema,
  model: AppModelSchema,
  message: AppMessageSchema
})
