import { UiSchema } from "@effect/ui"
import { Html, HtmlServer } from "@effect/ui/html"
import { assert, describe, it } from "@effect/vitest"
import { DateTime, Effect, Schema } from "effect"
import { Autocomplete } from "../src/feature/combobox/autocomplete.component.ts"
import { Combobox } from "../src/feature/combobox/combobox.component.ts"
import { Calendar } from "../src/feature/date/calendar.component.ts"
import { DateField } from "../src/feature/date/date-field.component.ts"
import { DatePicker } from "../src/feature/date/date-picker.component.ts"
import { RangeCalendar } from "../src/feature/date/range-calendar.component.ts"
import { FileDrop } from "../src/feature/file-drop/file-drop.component.ts"
import { ContextMenu } from "../src/feature/menu/context-menu.component.ts"
import { Menubar } from "../src/feature/menu/menubar.component.ts"
import { SortableList } from "../src/feature/sortable-list/sortable-list.component.ts"
import { VirtualList } from "../src/feature/virtual-list/virtual-list.component.ts"

const Msg = UiSchema.TaggedEnum({ Changed: {} })
const changed = () => Msg.Changed()
const today = DateTime.makeUnsafe("2026-11-26T00:00:00Z")
const month = DateTime.makeUnsafe("2026-11-01T00:00:00Z")
const fruits = [
  { value: "apple", label: "Apple" },
  { value: "pear", label: "Pear" }
]

const Pickers = Html.component({ name: "Pickers", model: Schema.Struct({}), message: Msg }).make({
  init: () => ({}),
  update: { Changed: ($) => $.model },
  view: (h) =>
    h.div.children(
      Calendar(h, {
        key: "single",
        value: DateTime.makeUnsafe("2026-11-15T00:00:00Z"),
        month,
        today,
        locale: "en-US",
        onPick: changed,
        onMonthChange: changed
      }),
      RangeCalendar(h, {
        key: "range",
        value: { start: DateTime.makeUnsafe("2026-11-10T00:00:00Z"), end: DateTime.makeUnsafe("2026-11-12T00:00:00Z") },
        month,
        today,
        locale: "en-US",
        onPick: changed,
        onMonthChange: changed
      }),
      DateField(h, { key: "field", label: "Event", value: today, locale: "en-GB", onCommit: changed }),
      DatePicker(h, {
        key: "picker",
        label: "Departure",
        value: today,
        month,
        today,
        open: false,
        locale: "en-GB",
        onOpenChange: changed,
        onPick: changed,
        onMonthChange: changed
      }),
      Combobox(h, {
        key: "combo",
        label: "Fruit",
        items: fruits,
        value: "pear",
        inputValue: "Pear",
        open: false,
        onOpenChange: changed,
        onPick: changed,
        onInput: changed
      }),
      Autocomplete(h, {
        key: "auto",
        label: "Tag",
        items: fruits,
        value: "ap",
        open: false,
        onOpenChange: changed,
        onUpdate: changed
      }),
      FileDrop(h, { key: "drop", label: "Photos", accept: ["image/*"], onPick: changed }),
      ContextMenu(h, {
        key: "context",
        open: false,
        onOpenChange: changed,
        onPick: changed,
        items: fruits,
        children: "report.pdf"
      }),
      Menubar(h, {
        key: "bar",
        label: "Editor",
        open: null,
        onOpenChange: changed,
        onPick: changed,
        menus: [
          { name: "File", items: fruits },
          { name: "Edit", items: fruits }
        ]
      }),
      SortableList(h, {
        key: "sort",
        label: "Tasks",
        items: [
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" }
        ],
        onReorder: changed,
        onTrailing: (item) => h.button.attr("aria-label", `More for ${item.label}`).children("…")
      }),
      VirtualList(h, {
        key: "virtual",
        label: "Rows",
        count: 1000,
        itemSize: 40,
        initialCount: 10,
        onItem: ({ index }) => `Row ${index}`
      })
    )
})

const render = HtmlServer.renderToHtml(Pickers, {}).pipe(Effect.map(({ html }) => html))

describe("pickers and lists", () => {
  it.effect("Calendar marks the picked day and today", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<button class="\S*Calendar_day__[^"]*"[^>]*data-selected>15</)
      assert.match(html, /aria-current="date" data-today/)
    })
  )

  it.effect("RangeCalendar marks the ends and the days between", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /data-selected data-range-start data-in-range>10</)
      assert.match(html, /data-in-range>11</)
    })
  )

  it.effect("DateField and DatePicker show the date in the locale's pattern", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.strictEqual(html.match(/<input class="\S*DateField_input__[^>]*value="26\/11\/2026"/g)?.length, 2)
      assert.match(html, /placeholder="dd\/mm\/yyyy"/)
      assert.match(html, /aria-haspopup="dialog" aria-expanded="false"/)
    })
  )

  it.effect("Combobox and Autocomplete render styled combobox inputs", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.strictEqual(html.match(/<input class="\S*Combobox_input__[^>]*role="combobox"/g)?.length, 2)
      assert.match(html, /<input class="\S*Combobox_input__[^>]*value="Pear"/)
    })
  )

  it.effect("Menubar holds a menu trigger per menu", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /aria-label="Editor"[^>]*role="menubar"|role="menubar"[^>]*aria-label="Editor"/)
      assert.match(html, /<button class="\S*Menubar_trigger__[^>]*aria-haspopup="menu"[^>]*>File</)
      assert.match(html, /aria-haspopup="menu"[^>]*>Edit</)
    })
  )

  it.effect("ContextMenu wraps its area and FileDrop draws a real button", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /<div class="\S*ContextMenu_area__[^"]*"[^>]*>report.pdf</)
      assert.match(html, /<button class="\S*FileDrop_trigger__[^"]*"[^>]*>Choose files</)
    })
  )

  it.effect("SortableList labels each handle and VirtualList draws only the first rows", () =>
    Effect.gen(function* () {
      // Arrange
      const page = render
      // Act
      const html = yield* page
      // Assert
      assert.match(html, /aria-label="Reorder Alpha"/)
      assert.match(html, /aria-label="Reorder Beta"/)
      assert.match(html, /Alpha<\/span><button aria-label="More for Alpha">/)
      assert.match(html, />Row 9</)
      assert.notMatch(html, />Row 10</)
    })
  )
})
