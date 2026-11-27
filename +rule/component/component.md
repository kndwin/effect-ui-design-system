# rule: component files

A `*.component.ts` file **exports UI**, as either:

- an `Html.component({...}).make({...})`, which is stateful: a Model, messages and Commands; or
- a view function, `(h, options) => …` or `(element, options) => …`, that returns elements.

Conventions:

- A component's look lives next to it in a `*.component.style.ts`, applied with
  `Style.classes(XStyle, options)`. The component file writes no CSS.
- A component exports itself. There is no registry and no barrel.
- Effects run as `Command`s from `update`, never at import time.
- Helpers that aren't UI go in a `*.pure.ts`.

## ✅ view function

```ts good
export const Badge = (h: { span: unknown }) => h.span
```

## ✅ stateful component

```ts good
import { Html } from "@effect/ui/html"
export const Counter = Html.component({ name: "Counter" })
```

## ❌ no UI → component/exports-ui

```ts bad
export const size = 4
```
