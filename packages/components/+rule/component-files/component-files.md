# rule: library component files

A `*.component.ts` file **exports UI**, as either:

- an `Html.component({...}).make({...})`, which is stateful: a Model, messages and Commands; or
- a view function, `(h, options) => …` or `(element, options) => …`, that returns elements; or
- `Element.styled(XStyle)`, when the component only puts its style's classes on an element the
  caller passes in. That is all a layout primitive does, so `center.component.ts` is one line.

Conventions:

- A component's look lives next to it in a `*.component.style.ts`, applied with
  `Style.classes(XStyle, options)` or `Element.styled(XStyle)`. The component file writes no CSS.
  The two files stay apart because the CSS engine replaces the style file with generated class
  lookups at build time.
- A component exports itself. There is no registry and no barrel.
- Effects run as `Command`s from `update`, never at import time.
- Helpers that aren't UI go in a `*.pure.ts`, constants in a `*.constant.ts`, Schemas in a
  `*.schema.ts`.

## ✅ view function

```ts good
export const Badge = (h: { span: unknown }) => h.span
```

## ✅ styled element

```ts good
import * as Element from "@acme/design-system/Element"
import { CenterStyle } from "./center.component.style.ts"

export const Center = Element.styled(CenterStyle)
```

## ✅ stateful component

```ts good
import { Html } from "@effect/ui/html"
export const Counter = Html.component({ name: "Counter" })
```

## ❌ no UI → component-files/exports-ui

```ts bad
export const size = 4
```
