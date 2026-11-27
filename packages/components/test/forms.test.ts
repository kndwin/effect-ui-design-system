import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Checkbox } from "../src/feature/checkbox/checkbox.component.ts"
import { Field } from "../src/feature/field/field.component.ts"
import { RadioGroup } from "../src/feature/radio-group/radio-group.component.ts"
import { Select } from "../src/feature/select/select.component.ts"
import { Slider } from "../src/feature/slider/slider.component.ts"
import { Switch } from "../src/feature/switch/switch.component.ts"
import { Toggle } from "../src/feature/toggle/toggle.component.ts"

const Msg = UiSchema.TaggedEnum({ Changed: {} })
const changed = () => Msg.Changed()

const Forms = Html.component({ name: "Forms", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Changed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Field(h, { key: "name", label: "Name", value: "", invalid: true, error: "Required", onUpdate: changed }),
      Checkbox(h, { key: "terms", label: "Terms", checked: false, indeterminate: true, onToggle: changed }),
      Switch(h, { label: "Email", checked: true, onToggle: changed }),
      RadioGroup(h, {
        key: "plan",
        label: "Plan",
        value: "pro",
        items: [
          { value: "hobby", label: "Hobby" },
          { value: "pro", label: "Pro" }
        ],
        onPick: changed
      }),
      Select(h, {
        key: "fruit",
        label: "Fruit",
        value: null,
        placeholder: "Pick",
        items: [{ value: "a", label: "A" }],
        onPick: changed
      }),
      Slider(h, { key: "volume", label: "Volume", value: 40, onMove: changed }),
      Toggle(h, { label: "Bold", pressed: true, onToggle: changed, children: "B" })
    )
})

const render = HtmlServer.renderToHtml(Forms, {}).pipe(Effect.map(({ html }) => html))

describe("form controls", () => {
  it.effect("Field links its label and shows the error with aria-invalid", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<label class="\S*Field_label__[^"]*"[^>]*for="([^"]+)">Name<\/label><input[^>]*id="\1"/)
      assert.match(html, /<input[^>]*aria-invalid="true"/)
      assert.match(html, /role="alert"[^>]*>Required</)
    })
  )

  it.effect("Checkbox, Switch, RadioGroup and Toggle carry their roles and states", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /role="checkbox"[^>]*aria-checked="mixed"|aria-checked="mixed"[^>]*role="checkbox"/)
      assert.match(html, /role="switch"/)
      assert.match(html, /aria-checked="true"/)
      assert.match(html, /role="radiogroup"[^>]*aria-label="Plan"|aria-label="Plan"[^>]*role="radiogroup"/)
      assert.match(html, /aria-pressed="true"/)
      assert.match(html, /Toggle_root__/)
    })
  )

  it.effect("Select renders a combobox trigger with its placeholder, and Slider a range input", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /role="combobox"/)
      assert.include(html, ">Pick<")
      assert.match(html, /<input[^>]*type="range"/)
      assert.match(html, /Slider_thumb__/)
    })
  )
})
