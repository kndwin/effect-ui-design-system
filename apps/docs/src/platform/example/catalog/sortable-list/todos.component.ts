import { SortableList } from "@weft/components/sortable-list"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Option, Schema } from "effect"

export const title = "Reorder tasks"
export const order = 1

const TodoSchema = Schema.Struct({ id: Schema.String, label: Schema.String })
const Msg = UiSchema.TaggedEnum({ Reordered: { from: Schema.Number, to: Schema.Number } })

export default Html.component({
  name: "SortableListTodos",
  model: Schema.Struct({ todos: Schema.Array(TodoSchema) }),
  message: Msg
}).make({
  init: () => ({
    todos: [
      { id: "design", label: "Design the token contract" },
      { id: "theme", label: "Write the shadcn theme" },
      { id: "docs", label: "Document every component" },
      { id: "ship", label: "Ship it" }
    ]
  }),
  update: {
    Reordered: ($, { from, to }) =>
      Array.get($.model.todos, from).pipe(
        Option.map((todo) => Array.insertAt(Array.remove($.model.todos, from), to, todo)),
        Option.flatten,
        Option.match({ onNone: () => $.model, onSome: (todos) => $.evolve({ todos }) })
      )
  },
  view: (h, model) =>
    SortableList(h, {
      label: "Tasks",
      items: model.todos,
      onReorder: ({ from, to }) => Msg.Reordered({ from, to })
    })
})
