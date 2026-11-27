import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Button, DS } from "../src/index.ts"

const Msg = UiSchema.TaggedEnum({ Pressed: {} })
const Demo = Html.component({ name: "Demo", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Pressed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Button(h, { tone: "primary", onPress: Msg.Pressed(), children: "Save" }),
      Button(h, { tone: "danger", size: "sm", loading: true, children: "Deleting" })
    )
})

describe("Button", () => {
  it.effect("tokens → variant classes on the rendered <button>", () =>
    Effect.gen(function*() {
      const { html } = yield* HtmlServer.renderToHtml(Demo, {})
      const buttons = [...html.matchAll(/<button[^>]*>/g)].map((m) => m[0])
      assert.strictEqual(buttons.length, 2)
      assert.match(buttons[0]!, /class="button__\w+ button_tone_primary__\w+ button_size_md__\w+"/)
      assert.match(buttons[1]!, /button_tone_danger__\w+ button_size_sm__\w+/)
      // loading → disabled + focusable + aria-busy
      assert.match(buttons[1]!, /aria-busy="true"/)
      assert.match(buttons[1]!, /aria-disabled="true"/)
      assert.match(buttons[1]!, /data-disabled/)
    }))

  it("manifest lists slots and variant values", () => {
    assert.deepStrictEqual(DS.manifest.components, [{
      kit: "Button",
      slots: ["root"],
      variants: {
        tone: { values: ["primary", "neutral", "danger"], default: "neutral" },
        size: { values: ["sm", "md"], default: "md" }
      }
    }])
  })
})
