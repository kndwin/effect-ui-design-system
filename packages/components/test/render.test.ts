import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Avatar } from "../src/avatar/avatar.component.ts"
import { Button } from "../src/button/button.component.ts"
import { CodeBlock } from "../src/code-block/code-block.component.ts"
import { manifest } from "../src/manifest.constant.ts"

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
      // Arrange
      const demo = Demo
      // Act
      const { html } = yield* HtmlServer.renderToHtml(demo, {})
      // Assert
      const buttons = [...html.matchAll(/<button[^>]*>/g)].map((m) => m[0])
      for (const cls of [/Button_root__/, /Button_root_tone_primary__/, /Button_root_size_md__/])
        assert.match(buttons[0]!, cls)
      for (const cls of [/Button_root_tone_danger__/, /Button_root_size_sm__/]) assert.match(buttons[1]!, cls)
      assert.match(buttons[1]!, /aria-busy="true"/)
      assert.match(buttons[1]!, /aria-disabled="true"/)
      assert.match(buttons[1]!, /data-disabled/)
    })
  )

  it.effect("Avatar: initials on the server, data-status on the root, hue from the name", () =>
    Effect.gen(function* () {
      // Arrange
      const demo = Demo
      // Act
      const { html } = yield* HtmlServer.renderToHtml(demo, {})
      // Assert
      const root = html.match(/<span class="([^"]*Avatar_root__[^"]+)"[^>]*data-status="(\w+)"/)
      assert.isNotNull(root)
      assert.match(root![1]!, /Avatar_root_size_lg__\w+ \S*Avatar_root_shape_square__\w+ \S*Avatar_root_hue_\w+__\w+/)
      assert.strictEqual(root![2], "loading")
      assert.match(html, /aria-label="Ada Lovelace">AL<\/span>/)
      assert.notInclude(html, "<img")
    })
  )

  it.effect("CodeBlock: title, copy button, line numbers, marks and token kinds", () =>
    Effect.gen(function* () {
      // Arrange
      const demo = Demo
      // Act
      const { html } = yield* HtmlServer.renderToHtml(demo, {})
      // Assert
      assert.match(html, /<span class="\S*CodeBlock_title__[^"]*">a\.ts<\/span>/)
      assert.match(html, /<button class="\S*CodeBlock_copy__[^"]*"[^>]*aria-label="Copy"/)
      assert.match(html, /data-token="keyword">const<\/span>/)
      assert.match(html, /data-token="string">"x"<\/span>/)
      assert.match(html, /data-token="comment">\/\/ hi<\/span>/)
      assert.match(html, /data-mark="added"[^>]*>.*?aria-hidden="true">2<\/span>/)
    })
  )

  it("manifest lists components, slots, variants and the token contract", () => {
    // Arrange
    const { components, tokens } = manifest
    // Act
    const shape = components.slice(0, 3).map((c) => [c.kit, c.slots, Object.keys(c.variants)])
    // Assert
    assert.deepStrictEqual(shape, [
      ["Button", ["root"], ["tone", "fill", "size"]],
      ["Avatar", ["root", "image", "fallback"], ["size", "shape", "hue"]],
      ["CodeBlock", ["root", "header", "title", "copy", "content", "line", "lineNumber", "token"], ["size", "tone"]]
    ])
    assert.deepStrictEqual(
      components.slice(3).map((c) => c.kit),
      [
        "Stack",
        "StackItem",
        "Grid",
        "GridSpan",
        "Center",
        "Section",
        "Layout",
        "LayoutHeader",
        "LayoutPanel",
        "LayoutContent",
        "LayoutFooter",
        "Text",
        "Swatch"
      ]
    )
    assert.deepStrictEqual(tokens.Colors?.kind, "Color")
  })
})
