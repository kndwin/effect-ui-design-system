# rule: schema files

A `*.schema.ts` file holds **Schemas**: the shapes of data, built with `Schema.*` (or
`UiSchema.*` for messages). Each export is a Schema, optionally with its type next to it:

```ts
export const Tone = Schema.Literals(["primary", "neutral", "danger"])
export type Tone = typeof Tone.Type
```

- Exports are Schemas and types only. A function goes in a `*.pure.ts`; a plain value in a
  `*.constant.ts`.
- Imports come from `effect`, `@effect/ui` or another `*.schema.ts`, so a schema never pulls in
  UI or build code.
- It is a data module, so `+rule/pure/pure.md` applies. It has no logic of its own, so it needs no
  test; the code that decodes with it is tested.

## ✅

```ts good
import { Schema } from "effect"

export const Size = Schema.Literals(["sm", "md"]).pipe(Schema.annotate({ title: "Size" }))
export type Size = typeof Size.Type
export const Point = Schema.Struct({ x: Schema.Number, y: Schema.Number })
```

## ❌ not a Schema → schema/only-schemas

```ts bad
import { Schema } from "effect"

export const Size = Schema.Literals(["sm", "md"])
export const sizes = ["sm", "md"] as const
```

## ❌ a function → schema/only-schemas

```ts bad
import { Schema } from "effect"

export const decodeSize = Schema.decodeUnknownSync(Schema.Literals(["sm", "md"]))
export const isSmall = (s: string) => s === "sm"
```

## ❌ imports UI → schema/imports

```ts bad
import { Schema } from "effect"
import { Button } from "./button.component.ts"

export const Props = Schema.Struct({ label: Schema.String })
```
