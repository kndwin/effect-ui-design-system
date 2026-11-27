import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Avatar, Button, CodeBlock, DS } from "../src/index.ts"

const Msg = UiSchema.TaggedEnum({ Pressed: {} })
const Demo = Html.component({ name: "Demo", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Pressed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Button(h, { tone: "primary", onPress: Msg.Pressed(), children: "Save" }),
      Button(h, { tone: "danger", size: "sm", loading: true, children: "Deleting" }),
      Avatar(h, { name: "Ada Lovelace", src: "/ada.png", size: "lg", shape: "square" }),
      CodeBlock(h, {
        code: 'const a = "x" // hi\nconst b = 2',
        title: "a.ts",
        lineNumbers: true,
        marks: { 2: "added" }
      })
    )
})

describe("components", () => {
  it.effect("Button: variant classes, and loading → disabled + focusable + aria-busy", () =>
    Effect.gen(function* () {
      const { html } = yield* HtmlServer.renderToHtml(Demo, {})
      const buttons = [...html.matchAll(/<button[^>]*>/g)].map((m) => m[0])
      assert.match(buttons[0]!, /class="button__\w+ button_tone_primary__\w+ button_size_md__\w+"/)
      assert.match(buttons[1]!, /button_tone_danger__\w+ button_size_sm__\w+/)
      assert.match(buttons[1]!, /aria-busy="true"/)
      assert.match(buttons[1]!, /aria-disabled="true"/)
      assert.match(buttons[1]!, /data-disabled/)
    })
  )

  it.effect("Avatar: initials on the server, data-status on the root, hue from the name", () =>
    Effect.gen(function* () {
      const { html } = yield* HtmlServer.renderToHtml(Demo, {})
      const root = html.match(/<span class="(avatar__[^"]+)"[^>]*data-status="(\w+)"/)
      assert.isNotNull(root)
      assert.match(root![1]!, /avatar_size_lg__\w+ avatar_shape_square__\w+ avatar_hue_\w+__\w+/)
      assert.strictEqual(root![2], "loading")
      assert.match(html, /aria-label="Ada Lovelace">AL<\/span>/)
      assert.notInclude(html, "<img")
    })
  )

  it.effect("CodeBlock: title, copy button, line numbers, marks and token kinds", () =>
    Effect.gen(function* () {
      const { html } = yield* HtmlServer.renderToHtml(Demo, {})
      assert.match(html, /<span class="code-block__\w+[^"]*">a\.ts<\/span>/)
      assert.match(html, /<button class="code-block__\w+[^"]*"[^>]*aria-label="Copy"/)
      assert.match(html, /data-token="keyword">const<\/span>/)
      assert.match(html, /data-token="string">"x"<\/span>/)
      assert.match(html, /data-token="comment">\/\/ hi<\/span>/)
      assert.match(html, /data-mark="added"[^>]*>.*?aria-hidden="true">2<\/span>/)
    })
  )

  it("manifest lists components, slots, variants and the token contract", () => {
    assert.deepStrictEqual(
      DS.manifest.components.map((c) => [c.kit, c.slots, Object.keys(c.variants)]),
      [
        ["Button", ["root"], ["tone", "size"]],
        ["Avatar", ["root", "image", "fallback"], ["size", "shape", "hue"]],
        ["CodeBlock", ["root", "header", "title", "copy", "content", "line", "lineNumber", "token"], ["size", "tone"]]
      ]
    )
    assert.deepStrictEqual(DS.manifest.tokens.Colors?.kind, "Color")
  })
})
