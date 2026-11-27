import { FileDrop } from "@acme/components/file-drop"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Schema } from "effect"

export const title = "Photos"
export const order = 1

const Msg = UiSchema.TaggedEnum({ Picked: { names: Schema.Array(Schema.String) }, Rejected: { reason: Schema.String } })

export default Html.component({
  name: "FileDropPhotos",
  model: Schema.Struct({ names: Schema.Array(Schema.String), error: Schema.NullOr(Schema.String) }),
  message: Msg
}).make({
  init: () => ({ names: [], error: null }),
  update: {
    Picked: ($, { names }) => ({ names: [...$.model.names, ...names], error: null }),
    Rejected: ($, { reason }) => $.evolve({ error: reason })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      FileDrop(h, {
        label: "Upload photos",
        trigger: "Choose photos",
        hint: "PNG or JPEG, or drop them here",
        accept: ["image/*"],
        multiple: true,
        onPick: ({ files }) => Msg.Picked({ names: files.map((file) => file.name) }),
        onReject: ({ reason }) => Msg.Rejected({ reason })
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(model.error).pipe(
          Match.when(null, () =>
            Match.value(Array.isReadonlyArrayNonEmpty(model.names)).pipe(
              Match.when(true, () => model.names.join(", ")),
              Match.orElse(() => "No photos yet.")
            )
          ),
          Match.orElse((reason) => `Rejected: ${reason}`)
        )
      )
    )
})
