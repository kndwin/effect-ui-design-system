import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Redacted, Schema } from "effect"
import { CheckboxGroup } from "../src/feature/checkbox/checkbox-group.component.ts"
import { Field } from "../src/feature/field/field.component.ts"
import { Fieldset } from "../src/feature/fieldset/fieldset.component.ts"
import { Form } from "../src/feature/form/form.component.ts"
import { NumberField } from "../src/feature/number-field/number-field.component.ts"
import { OtpField } from "../src/feature/otp-field/otp-field.component.ts"
import { PreviewCard } from "../src/feature/preview-card/preview-card.component.ts"
import { Meter } from "../src/feature/progress/meter.component.ts"
import { Progress } from "../src/feature/progress/progress.component.ts"
import { ToggleGroup } from "../src/feature/toggle/toggle-group.component.ts"

const Msg = UiSchema.TaggedEnum({ Changed: {} })
const changed = () => Msg.Changed()

const Inputs = Html.component({ name: "Inputs", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Changed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Progress(h, { key: "upload", label: "Upload", value: 40 }),
      Progress(h, { key: "busy", label: "Busy", value: null }),
      Meter(h, { key: "disk", label: "Disk", value: 72 }),
      CheckboxGroup(h, {
        key: "perms",
        label: "Permissions",
        parentLabel: "All",
        items: [
          { value: "read", label: "Read" },
          { value: "write", label: "Write" }
        ],
        value: ["read"],
        onUpdate: changed
      }),
      ToggleGroup(h, {
        key: "align",
        label: "Align",
        items: [
          { value: "left", label: "Left" },
          { value: "right", label: "Right" }
        ],
        value: ["left"],
        onToggle: changed
      }),
      Form(h, {
        key: "form",
        label: "Billing",
        onSubmit: changed,
        children: [
          Fieldset(h, {
            key: "set",
            legend: "Details",
            disabled: true,
            children: [Field(h, { key: "company", label: "Company", value: "", onUpdate: changed })]
          })
        ]
      }),
      NumberField(h, { key: "qty", label: "Quantity", value: 3, min: 0, name: "qty", onUpdate: changed }),
      OtpField(h, { key: "otp", label: "Code", value: Redacted.make("12"), length: 4, onUpdate: changed }),
      PreviewCard(h, {
        key: "card",
        open: false,
        onOpenChange: changed,
        trigger: "Tokens",
        href: "#tokens",
        children: []
      })
    )
})

const render = HtmlServer.renderToHtml(Inputs, {}).pipe(Effect.map(({ html }) => html))

describe("inputs and feedback", () => {
  it.effect("Progress sizes its indicator from the value and marks null as indeterminate", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /role="progressbar"[^>]*aria-valuenow="40"/)
      assert.match(html, /class="\S*Progress_indicator__[^"]*"[^>]*style="[^"]*width:\s*40%/)
      assert.match(html, /data-indeterminate role="progressbar"/)
      assert.match(html, /role="meter"[^>]*aria-valuenow="72"/)
    })
  )

  it.effect("CheckboxGroup shows a mixed parent over its members", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /aria-label="Permissions" role="group"/)
      assert.match(html, /aria-checked="mixed"/)
      assert.match(html, /class="\S*CheckboxGroup_items__/)
    })
  )

  it.effect("ToggleGroup presses the selected item with the Toggle style", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<button class="\S*Toggle_root__[^"]*"[^>]*aria-pressed="true"[^>]*>Left</)
    })
  )

  it.effect("Fieldset disables the fields inside a novalidate form", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<form class="\S*Form_root__[^"]*"[^>]*novalidate/)
      assert.match(html, /<fieldset class="\S*Fieldset_root__[^"]*"[^>]*disabled/)
      assert.match(html, /<input[^>]*disabled/)
    })
  )

  it.effect("NumberField labels its input and draws both steppers", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(
        html,
        /<label class="\S*NumberField_label__[^"]*" for="([^"]+)">Quantity<\/label>[\s\S]*<input class="\S*NumberField_input__[^"]*" id="\1"/
      )
      assert.match(html, /aria-label="Decrease"/)
      assert.match(html, /aria-label="Increase"/)
    })
  )

  it.effect("OtpField draws one slot per digit and fills the typed ones", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.strictEqual(html.match(/<input class="\S*OtpField_slot__/g)?.length, 4)
      assert.strictEqual(html.match(/<input class="\S*OtpField_slot__[^>]*data-filled/g)?.length, 2)
    })
  )

  it.effect("PreviewCard keeps the trigger a plain link", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<a class="\S*PreviewCard_trigger__[^"]*"[^>]*href="#tokens"/)
      assert.notMatch(html, /aria-expanded/)
    })
  )
})
