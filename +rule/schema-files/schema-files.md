# rule: schema files

A `*.schema.ts` file holds **Schemas**: the shapes of data, built with `Schema.*` (or
`UiSchema.*` for messages). Each export is a Schema, optionally with its type next to it:

```ts
export const Tone = Schema.Literals(["primary", "neutral", "danger"])
export type Tone = typeof Tone.Type
```

- Exports are Schemas and types only. A function goes in a `*.pure.ts`; a plain value in a
  `*.constant.ts`.
- Imports come from `effect`, `@effect/ui`, another `*.schema.ts`, or a package export of one,
  named `…Schema` (`@acme/design-system/ThemeSchema`). A schema never pulls in UI or build code.
- Exported functions in a `*.pure.ts` take their input as one of these Schema types
  (`+rule/pure-files/pure-files.md`).
- It is a data module, so `+rule/pure-files/pure-files.md` applies. It has no logic of its own, so it needs no
  test; the code that decodes with it is tested.

## ✅

```ts good
import { Schema } from "effect"

export const Size = Schema.Literals(["sm", "md"]).pipe(Schema.annotate({ title: "Size" }))
export type Size = typeof Size.Type
export const Point = Schema.Struct({ x: Schema.Number, y: Schema.Number })
```

## ❌ not a Schema → schema-files/only-schemas

```ts bad
import { Schema } from "effect"

export const Size = Schema.Literals(["sm", "md"])
export const sizes = ["sm", "md"] as const
```

## ❌ a function → schema-files/only-schemas

```ts bad
import { Schema } from "effect"

export const decodeSize = Schema.decodeUnknownSync(Schema.Literals(["sm", "md"]))
export const isSmall = (s: string) => s === "sm"
```

## ❌ imports UI → schema-files/imports

```ts bad
import { Schema } from "effect"
import { Button } from "./button.component.ts"

export const Props = Schema.Struct({ label: Schema.String })
```
