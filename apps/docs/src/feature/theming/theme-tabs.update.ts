import { ThemeTabsDef } from "./theme-tabs.define.ts"
import { ThemeTabsEventsSchema } from "./theme-tabs.schema.ts"

export const update = ThemeTabsDef.update({
  PressedTab: ($, { value }) => $.evolve({ tab: value }),
  PressedCustomize: ($) => $.emit(ThemeTabsEventsSchema.OpenedPanel())
})
