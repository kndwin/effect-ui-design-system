import { Array, Option } from "effect"
import { AppDef } from "./app.define.ts"
import { update } from "./app.update.ts"
import { view } from "./app.view.ts"

export const App = AppDef.make({
  init: ($) => ({
    selected: Option.match(Array.head($.props.looms), {
      onNone: () => ({ title: "", scenario: "" }),
      onSome: (loom) => ({ title: loom.title, scenario: "" })
    }),
    run: 0,
    clips: [],
    at: null,
    mode: "light" as const
  }),
  update,
  view
})
