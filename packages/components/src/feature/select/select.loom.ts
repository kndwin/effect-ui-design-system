import * as Loom from "@weft/loom/Loom"
import { HtmlLocator } from "@effect/ui/html/testing"
import { Select } from "./select.component.ts"
import { SelectMessageSchema } from "./select.schema.ts"

export default Loom.make({
  title: "Select",
  args: {
    label: "Fruit",
    value: null,
    items: [
      { value: "apple", label: "Apple" },
      { value: "pear", label: "Pear" }
    ]
  },
  render: (h, args) => Select(h, { ...args, onPick: ({ value }) => ({ value }) }),

  scenarios: {
    opens: [SelectMessageSchema.RequestedOpen()],

    "picks apple then pear": [
      SelectMessageSchema.RequestedOpen(),
      SelectMessageSchema.PickedValue({ value: "apple" }),
      SelectMessageSchema.RequestedOpen(),
      SelectMessageSchema.PickedValue({ value: "pear" })
    ],

    "opens then closes": [SelectMessageSchema.RequestedOpen(), SelectMessageSchema.RequestedClose()],

    "opens with the keyboard": [
      (root: HTMLElement) =>
        HtmlLocator.keydown(HtmlLocator.getByRole(root, "combobox", { name: "Fruit" }), "ArrowDown")
    ],

    "click while disabled": {
      args: { disabled: true },
      steps: [(root: HTMLElement) => HtmlLocator.click(HtmlLocator.getByRole(root, "combobox", { name: "Fruit" }))]
    }
  }
})
