import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { ExampleModelSchema, ExamplePropsSchema } from "./example.schema.ts"

export const ExampleDef = Html.component({
  name: "Example",
  props: ExamplePropsSchema,
  model: ExampleModelSchema,
  message: Schema.Never
})
