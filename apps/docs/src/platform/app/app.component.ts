import { initialChoices } from "../../feature/theme-builder/theme-builder.constant.ts"
import { AppDef } from "./app.define.ts"
import { subscriptions } from "./app.subscription.ts"
import { update } from "./app.update.ts"
import { head, view } from "./app.view.ts"

export const App = AppDef.make({
  init: ($) => ({ route: $.props.route, panel: false, choices: initialChoices, copied: false }),
  update,
  subscriptions,
  head,
  view
})
