import { Command, Router } from "@effect/ui"
import { Match } from "effect"
import { initialChoices } from "../../feature/theme-builder/theme-builder.constant.ts"
import { getPageMarkdown } from "../markdown/markdown.pure.ts"
import { ClearCopiedPage, CopyPage } from "./app.command.ts"
import { AppDef } from "./app.define.ts"
import { getPage } from "./app.pure.ts"
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
  ChangedPanel: ($, { open }) => $.evolve({ panel: open }),
  Chose: ($, { choices }) => $.evolve({ choices }),
  PressedCopyPage: ($) =>
    Match.value(getPage({ route: $.model.route })).pipe(
      Match.when(undefined, () => $.model),
      Match.orElse((page) => $.run(CopyPage.make({ text: getPageMarkdown({ page }) })))
    ),
  CopiedPage: ($) => $.evolve({ copied: true }).run(ClearCopiedPage.make({})),
  CopyPageFailed: ($) => $.model,
  ClearedCopiedPage: ($) => $.evolve({ copied: false }),
  ResetChoices: ($) => $.evolve({ choices: { ...initialChoices, custom: true } })
})
