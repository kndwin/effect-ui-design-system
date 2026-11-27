import { Html } from "@effect/ui/html"
import {
  ThemeBuilderEventsSchema,
  ThemeBuilderMessageSchema,
  ThemeBuilderModelSchema,
  ThemeBuilderPropsSchema
} from "./theme-builder.schema.ts"

export const ThemeBuilderDef = Html.component({
  name: "ThemeBuilder",
  props: ThemeBuilderPropsSchema,
  model: ThemeBuilderModelSchema,
  message: ThemeBuilderMessageSchema,
  events: ThemeBuilderEventsSchema
})
