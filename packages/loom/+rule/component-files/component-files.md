# rule: app component files

In an app, a `*.component.ts` file exports an **`Html.component`**: the app's own stateful UI,
built from `@weft/components`. Apps don't define styled primitives or view helpers for others to
reuse; those belong in `@weft/components` (see its `+rule/component-files/component-files.md`).

## ✅ app component

```ts good
import { Html } from "@effect/ui/html"

export const Loom = Html.component({ name: "Loom" })
```

## ❌ a view function → component-files/app-component

```ts bad
export const Badge = (h: { span: unknown }) => h.span
```
