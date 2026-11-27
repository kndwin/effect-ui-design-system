import { Match } from "effect"
import { ThemeBuilderDef } from "./theme-builder.define.ts"
import { ThemeBuilderEventsSchema } from "./theme-builder.schema.ts"

export const update = ThemeBuilderDef.update({
  PressedTheme: ($, { theme }) =>
    Match.value(theme).pipe(
      Match.when("custom", () =>
        $.emit(ThemeBuilderEventsSchema.Chose({ choices: { ...$.props.choices, custom: true } }))
      ),
      Match.orElse(() => $.emit(ThemeBuilderEventsSchema.PickedTheme({ theme })))
    ),
  PressedMode: ($, { mode }) => $.emit(ThemeBuilderEventsSchema.PickedMode({ mode })),
  PressedChoice: ($, { choices }) => $.emit(ThemeBuilderEventsSchema.Chose({ choices })),
  PressedReset: ($) => $.emit(ThemeBuilderEventsSchema.Reset()),
  PressedClose: ($) => $.emit(ThemeBuilderEventsSchema.Closed())
})
