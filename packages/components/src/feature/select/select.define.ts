import { Html } from "@effect/ui/html"
import { SelectEventsSchema, SelectMessageSchema, SelectModelSchema, SelectPropsSchema } from "./select.schema.ts"

export const SelectDef = Html.component({
  name: "Select",
  props: SelectPropsSchema,
  model: SelectModelSchema,
  message: SelectMessageSchema,
  events: SelectEventsSchema
})
