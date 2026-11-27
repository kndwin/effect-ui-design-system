# rule: app component files

In an app, a `*.component.ts` file exports an **`Html.component`**: the app's own stateful UI,
built from `@acme/components`. Apps don't define styled primitives or view helpers for others to
reuse; those belong in `@acme/components` (see its `+rule/component-files/component-files.md`).

Docs examples, `src/examples/<page>/<name>.component.ts`, are found by `registry.constant.ts`,
so each one also exports:

- `default`: the example's `Html.component`
- `title`: the heading shown above it
- `order`: its place on the page

## ✅ app component

```ts good
import { Html } from "@effect/ui/html"
export const Docs = Html.component({ name: "Docs" })
```

## ✅ docs example

```ts good path=apps/docs/src/platform/example/catalog/rule-test/sizes.component.ts
import { Html } from "@effect/ui/html"

export const title = "Sizes"
export const order = 1

export default Html.component({ name: "Sizes" })
```

## ❌ a view function → component-files/app-component

```ts bad
export const Badge = (h: { span: unknown }) => h.span
```

## ❌ an example without its title and order → component-files/example-metadata

```ts bad path=apps/docs/src/platform/example/catalog/rule-test/untitled.component.ts
import { Html } from "@effect/ui/html"

export default Html.component({ name: "Untitled" })
```
