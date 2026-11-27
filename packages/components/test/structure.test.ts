import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { Accordion } from "../src/feature/accordion/accordion.component.ts"
import { Collapsible } from "../src/feature/collapsible/collapsible.component.ts"
import { NavigationMenu } from "../src/feature/navigation-menu/navigation-menu.component.ts"
import { Separator } from "../src/feature/separator/separator.component.ts"
import { Tabs } from "../src/feature/tabs/tabs.component.ts"
import { Toolbar } from "../src/feature/toolbar/toolbar.component.ts"

const Msg = UiSchema.TaggedEnum({ Changed: {} })
const changed = () => Msg.Changed()

const Structure = Html.component({ name: "Structure", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Changed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Tabs(h, {
        key: "tabs",
        value: "a",
        onSelect: changed,
        tabs: [
          { value: "a", label: "Alpha", content: ["Panel A"] },
          { value: "b", label: "Beta", content: ["Panel B"] }
        ]
      }),
      Accordion(h, {
        key: "accordion",
        value: ["q1"],
        onValueChange: changed,
        items: [
          { value: "q1", title: "First", content: ["Answer one"] },
          { value: "q2", title: "Second", content: ["Answer two"] }
        ]
      }),
      Collapsible(h, { key: "collapsible", open: false, onOpenChange: changed, trigger: "More", children: ["Hidden"] }),
      Separator(h, { orientation: "vertical" }),
      Toolbar(h, {
        key: "toolbar",
        label: "Format",
        items: [{ value: "bold", label: "Bold", glyph: "B", pressed: true, onPress: Msg.Changed() }, "separator"]
      }),
      NavigationMenu(h, { key: "nav", label: "Main", links: [{ href: "/", label: "Home", active: true }] })
    )
})

const render = HtmlServer.renderToHtml(Structure, {}).pipe(Effect.map(({ html }) => html))

describe("structure", () => {
  it.effect("Tabs show only the active panel, and Accordion only the open item", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /role="tab"[^>]*aria-selected="true"[^>]*>Alpha<|aria-selected="true"[^>]*>Alpha</)
      assert.include(html, "Panel A")
      assert.notInclude(html, "Panel B")
      assert.include(html, "Answer one")
      assert.notInclude(html, "Answer two")
      assert.notInclude(html, ">Hidden<")
    })
  )

  it.effect("Separator, Toolbar and NavigationMenu carry their roles", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(
        html,
        /role="separator"[^>]*aria-orientation="vertical"|aria-orientation="vertical"[^>]*role="separator"/
      )
      assert.match(html, /role="toolbar"/)
      assert.match(html, /aria-pressed="true"/)
      assert.match(html, /<nav[^>]*aria-label="Main"/)
      assert.match(html, /aria-current="page"/)
    })
  )
})
