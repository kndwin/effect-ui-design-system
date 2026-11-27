import { Button } from "@weft/components/button"
import { VStack } from "@weft/components/layout/stack"
import { Progress } from "@weft/components/progress"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Number, Schema } from "effect"

export const title = "Upload and a busy task"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Advanced: {} })

export default Html.component({
  name: "ProgressUpload",
  model: Schema.Struct({ value: Schema.Number }),
  message: Msg
}).make({
  init: () => ({ value: 40 }),
  update: { Advanced: ($) => $.evolve({ value: Number.clamp($.model.value + 20, { minimum: 0, maximum: 100 }) }) },
  view: (h, { value }) =>
    VStack(h.div, { gap: "4" }).children(
      Progress(h, { key: "upload", label: "Uploading", value }),
      Progress(h, { key: "sync", label: "Syncing", value: null }),
      Button(h, { element: h.button.on("click", Msg.Advanced()), size: "sm", children: "Advance" })
    )
})
