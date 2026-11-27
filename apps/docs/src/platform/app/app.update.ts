import { Command, Router } from "@effect/ui"
import { Match } from "effect"
import { initialChoices } from "../../feature/theme-builder/theme-builder.constant.ts"
import { AppDef } from "./app.define.ts"
import { AppRoute } from "./app.route.ts"

export const update = AppDef.update({
  ChangedRoute: ($, { route }) => $.evolve({ route }),
  PressedMode: ($) =>
    $.run(
      Router.patchSearch(AppRoute, $.model.route, {
        mode: Match.value($.model.route.search.mode).pipe(
          Match.when("light", () => "dark" as const),
          Match.orElse(() => "light" as const)
        )
      }).pipe(Command.asNoop)
    ),
  PickedMode: ($, { mode }) => $.run(Router.patchSearch(AppRoute, $.model.route, { mode }).pipe(Command.asNoop)),
  PickedTheme: ($, { theme }) =>
    $.evolve({ choices: initialChoices }).run(
      Router.patchSearch(AppRoute, $.model.route, { theme }).pipe(Command.asNoop)
    ),
  PressedPanel: ($) => $.evolve({ panel: (open) => !open }),
  Chose: ($, { choices }) => $.evolve({ choices }),
  ResetChoices: ($) => $.evolve({ choices: { ...initialChoices, custom: true } })
})
