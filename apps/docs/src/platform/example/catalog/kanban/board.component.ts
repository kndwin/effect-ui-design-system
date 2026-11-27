import { Grid } from "@weft/components/layout/grid"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Menu } from "@weft/components/menu"
import { SortableList } from "@weft/components/sortable-list"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Option, Schema } from "effect"

export const title = "Project board"
export const order = 1

const LaneSchema = Schema.Literals(["todo", "doing", "done"])
type Lane = typeof LaneSchema.Type

const CardSchema = Schema.Struct({ id: Schema.String, label: Schema.String })
type Card = typeof CardSchema.Type

const Msg = UiSchema.TaggedEnum({
  Reordered: { lane: LaneSchema, from: Schema.Number, to: Schema.Number },
  Moved: { id: Schema.String, to: Schema.String },
  ChangedMenu: { id: Schema.String, open: Schema.Boolean }
})

const lanes: ReadonlyArray<readonly [Lane, string]> = [
  ["todo", "To do"],
  ["doing", "In progress"],
  ["done", "Done"]
]

const getLaneTitle = (lane: Lane) => lanes.find(([id]) => id === lane)?.[1] ?? lane

const moveWithin = (cards: ReadonlyArray<Card>, from: number, to: number) =>
  Array.get(cards, from).pipe(
    Option.flatMap((card) => Array.insertAt(Array.remove(cards, from), to, card)),
    Option.getOrElse(() => cards)
  )

export default Html.component({
  name: "KanbanBoard",
  model: Schema.Struct({
    todo: Schema.Array(CardSchema),
    doing: Schema.Array(CardSchema),
    done: Schema.Array(CardSchema),
    menu: Schema.NullOr(Schema.String)
  }),
  message: Msg
}).make({
  init: () => ({
    todo: [
      { id: "tokens", label: "Audit the token contract" },
      { id: "dark", label: "Dark mode for charts" },
      { id: "docs", label: "Write the theming guide" }
    ],
    doing: [
      { id: "kanban", label: "Kanban template" },
      { id: "inbox", label: "Inbox template" }
    ],
    done: [{ id: "rename", label: "Rename to Weft" }],
    menu: null
  }),
  update: {
    Reordered: ($, { lane, from, to }) => ({ ...$.model, [lane]: moveWithin($.model[lane], from, to) }),
    Moved: ($, { id, to }) =>
      Match.value(to).pipe(
        Match.when(Schema.is(LaneSchema), (target) => {
          const card = Array.findFirst(
            lanes.flatMap(([lane]) => $.model[lane]),
            (c) => c.id === id
          )
          return Option.match(card, {
            onNone: () => $.model,
            onSome: (found) => ({
              todo: Array.filter($.model.todo, (c) => c.id !== id),
              doing: Array.filter($.model.doing, (c) => c.id !== id),
              done: Array.filter($.model.done, (c) => c.id !== id),
              [target]: [...Array.filter($.model[target], (c) => c.id !== id), found],
              menu: null
            })
          })
        }),
        Match.orElse(() => $.model)
      ),
    ChangedMenu: ($, { id, open }) =>
      $.evolve({
        menu: Match.value(open).pipe(
          Match.when(true, () => id),
          Match.orElse(() => null)
        )
      })
  },
  view: (h, model) =>
    Grid(h.div, { columns: "3", gap: "3", stack: true })
      .attr("style", "width:100%;align-items:start")
      .children(
        ...lanes.map(([lane, laneTitle]) =>
          Section(h.section, { surface: "muted", pad: "3", gap: "3" }).children(
            HStack(h.div, { justify: "between", align: "center", gap: "2" }).children(
              Text(h.h3, { size: "sm", weight: "semibold" }).children(laneTitle),
              Text(h.span, { size: "xs", tone: "muted" }).children(String(model[lane].length))
            ),
            Match.value(model[lane].length).pipe(
              Match.when(0, () =>
                VStack(h.div, { gap: "1" }).children(
                  Text(h.p, { size: "sm", tone: "muted" }).children("Nothing here. Move a card in with its menu.")
                )
              ),
              Match.orElse(() =>
                SortableList(h, {
                  key: `lane-${lane}`,
                  label: laneTitle,
                  items: model[lane],
                  stacked: true,
                  onReorder: ({ from, to }) => Msg.Reordered({ lane, from, to }),
                  onTrailing: (card) =>
                    Menu(h, {
                      key: `menu-${card.id}`,
                      open: model.menu === card.id,
                      onOpenChange: ({ open }) => Msg.ChangedMenu({ id: card.id, open }),
                      onPick: ({ value }) => Msg.Moved({ id: card.id, to: value }),
                      trigger: "Move",
                      size: "sm",
                      items: lanes
                        .filter(([other]) => other !== lane)
                        .map(([other]) => ({ value: other, label: getLaneTitle(other) }))
                    })
                })
              )
            )
          )
        )
      )
})
