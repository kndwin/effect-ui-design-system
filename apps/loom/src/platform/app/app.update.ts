import { Match } from "effect"
import { getSteppedAt } from "../../feature/timeline/timeline.pure.ts"
import { AppDef } from "./app.define.ts"

export const update = AppDef.update({
  PressedScenario: ($, { selected }) => ({ ...$.model, selected, clips: [], at: null, run: $.model.run + 1 }),
  PressedRun: ($) => ({ ...$.model, clips: [], at: null, run: $.model.run + 1 }),
  PressedStep: ($, { direction }) => ({
    ...$.model,
    at: Match.value(direction).pipe(
      Match.when("end", () => null),
      Match.orElse(() => getSteppedAt({ clips: $.model.clips, at: $.model.at, direction }))
    )
  }),
  Scrubbed: ($, { at }) => ({ ...$.model, at }),
  PressedMode: ($) => ({
    ...$.model,
    mode: Match.value($.model.mode).pipe(
      Match.when("light", () => "dark" as const),
      Match.orElse(() => "light" as const)
    )
  }),
  Recorded: ($, { clips }) => ({ ...$.model, clips })
})
