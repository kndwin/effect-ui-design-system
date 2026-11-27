import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { Effect, Schema } from "effect"
import { AlertDialog } from "../src/feature/dialog/alert-dialog.component.ts"
import { Dialog } from "../src/feature/dialog/dialog.component.ts"
import { Drawer } from "../src/feature/drawer/drawer.component.ts"
import { Menu } from "../src/feature/menu/menu.component.ts"
import { Popover } from "../src/feature/popover/popover.component.ts"
import { Tooltip } from "../src/feature/tooltip/tooltip.component.ts"

const Msg = UiSchema.TaggedEnum({ Changed: {} })
const changed = () => Msg.Changed()

const Overlays = Html.component({ name: "Overlays", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Changed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Dialog(h, {
        key: "dialog",
        open: true,
        onOpenChange: changed,
        trigger: "Edit",
        title: "Edit profile",
        description: "Shown publicly."
      }),
      AlertDialog(h, {
        key: "alert",
        open: false,
        onOpenChange: changed,
        trigger: "Delete",
        title: "Delete?",
        description: "No undo.",
        confirm: "Delete",
        onConfirm: Msg.Changed()
      }),
      Drawer(h, { key: "drawer", open: false, onOpenChange: changed, trigger: "Filters", title: "Filters" }),
      Popover(h, { key: "popover", open: false, onOpenChange: changed, trigger: "Options" }),
      Tooltip(h, { key: "tooltip", open: false, onOpenChange: changed, label: "Undo", trigger: "↶", content: "Undo" }),
      Menu(h, {
        key: "menu",
        open: false,
        onOpenChange: changed,
        onPick: changed,
        trigger: "Actions",
        items: [{ value: "rename", label: "Rename" }, "separator", { value: "delete", label: "Delete", danger: true }]
      })
    )
})

const render = HtmlServer.renderToHtml(Overlays, {}).pipe(Effect.map(({ html }) => html))

describe("overlays", () => {
  it.effect("an open Dialog renders its title and description, labelled and described", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<dialog[^>]*aria-labelledby="([^"]+)"[^>]*>[\s\S]*<h2[^>]*id="\1"[^>]*>Edit profile<\/h2>/)
      assert.match(html, /Dialog_popup__/)
      assert.include(html, "Shown publicly.")
    })
  )

  it.effect("every trigger is a styled button that says what it opens", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /aria-haspopup="dialog"[^>]*>Delete<|>Delete<\/button>/)
      assert.match(html, /aria-haspopup="menu"|aria-haspopup="true"/)
      assert.match(html, /aria-label="Undo"/)
      assert.match(html, /Button_root__[^"]*"[^>]*>Filters</)
    })
  )
})
