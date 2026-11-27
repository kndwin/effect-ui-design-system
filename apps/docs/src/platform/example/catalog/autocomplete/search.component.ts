import { Autocomplete } from "@acme/components/autocomplete"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Search with suggestions"
export const order = 1

const tags = ["effect", "schema", "stream", "layer", "fiber", "scope"].map((tag) => ({ value: tag, label: tag }))

const Msg = UiSchema.TaggedEnum({ ChangedOpen: { open: Schema.Boolean }, Updated: { value: Schema.String } })

export default Html.component({
  name: "AutocompleteSearch",
  model: Schema.Struct({ open: Schema.Boolean, query: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: false, query: "" }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open }),
    Updated: ($, { value }) => $.evolve({ query: value })
  },
  view: (h, model) =>
    Autocomplete(h, {
      label: "Tag",
      placeholder: "Type a tag",
      items: tags,
      value: model.query,
      open: model.open,
      onOpenChange: ({ open }) => Msg.ChangedOpen({ open }),
      onUpdate: ({ value }) => Msg.Updated({ value })
    })
})
