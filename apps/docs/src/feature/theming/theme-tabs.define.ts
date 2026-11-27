import { Html } from "@effect/ui/html"
import {
  ThemeTabsEventsSchema,
  ThemeTabsMessageSchema,
  ThemeTabsModelSchema,
  ThemeTabsPropsSchema
} from "./theme-tabs.schema.ts"

export const ThemeTabsDef = Html.component({
  name: "ThemeTabs",
  props: ThemeTabsPropsSchema,
  model: ThemeTabsModelSchema,
  message: ThemeTabsMessageSchema,
  events: ThemeTabsEventsSchema
})
