import { Menubar } from "@acme/components/menubar"
import { VStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Editor menus"
export const order = 1

const Msg = UiSchema.TaggedEnum({
  ChangedOpen: { menu: Schema.String, open: Schema.Boolean },
  Picked: { menu: Schema.String, value: Schema.String }
})

export default Html.component({
  name: "MenubarEditor",
  model: Schema.Struct({ open: Schema.NullOr(Schema.String), last: Schema.String }),
  message: Msg
}).make({
  init: () => ({ open: null, last: "Nothing yet." }),
  update: {
    ChangedOpen: ($, { menu, open }) =>
      Match.value(open).pipe(
        Match.when(true, () => $.evolve({ open: menu })),
        Match.orElse(() =>
          Match.value($.model.open === menu).pipe(
            Match.when(true, () => $.evolve({ open: null })),
            Match.orElse(() => $.model)
          )
        )
      ),
    Picked: ($, { menu, value }) => $.evolve({ last: `${menu} → ${value}` })
  },
  view: (h, model) =>
    VStack(h.div, { gap: "3" }).children(
      Menubar(h, {
        label: "Editor",
        open: model.open,
        onOpenChange: ({ menu, open }) => Msg.ChangedOpen({ menu, open }),
        onPick: ({ menu, value }) => Msg.Picked({ menu, value }),
        menus: [
          {
            name: "File",
            items: [
              { value: "new", label: "New" },
              { value: "open", label: "Open…" },
              "separator",
              { value: "save", label: "Save" }
            ]
          },
          {
            name: "Edit",
            items: [
              { value: "undo", label: "Undo" },
              { value: "redo", label: "Redo" }
            ]
          },
          {
            name: "View",
            items: [
              { value: "zoom-in", label: "Zoom in" },
              { value: "zoom-out", label: "Zoom out" }
            ]
          }
        ]
      }),
      Text(h.p, { size: "sm", tone: "muted" }).children(model.last)
    )
})
