import { Html } from "@effect/ui/html"
import { ExampleMessageSchema, ExampleModelSchema, ExamplePropsSchema } from "./example.schema.ts"

export const ExampleDef = Html.component({
  name: "Example",
  props: ExamplePropsSchema,
  model: ExampleModelSchema,
  message: ExampleMessageSchema
})
