# rule: pure files

A `*.pure.ts`, `*.pure.map.ts` or `*.pure.predicate.ts` file holds **pure functions**. Importing it does nothing, and its functions give the
same output for the same input. The other data kinds follow the same no-effects rule: `*.make.ts`,
`*.schema.ts`, `*.constant.ts`, `*.component.style.ts`, `*.token.ts` and `*.theme.ts`.

A `*.pure.ts` exports functions and types only. Plain values go in a `*.constant.ts`
(`+rule/constant-files/constant-files.md`), and Schemas in a `*.schema.ts` (`+rule/schema-files/schema-files.md`).

Every `*.pure.ts` has a `*.pure.test.ts` next to it (`+rule/test-files/test-files.md`).

Allowed: exported `const` functions and types; private constants and helpers; imports of other data
modules and `effect`.

Not allowed:

- ambient effects: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`,
  `fetch`, `console`, `process`, `globalThis`
- non-determinism: `Math.random()`, `Date.now()`, `new Date()`
- module state: top-level `let` or `var`
- statements that run on import
- `Html.component(...)`: UI goes in a `*.component.ts`

Effects belong in a `*.component.ts` (as `Command`s run from `update`) or in `apps/*/src/main.ts`.

## Inputs: one object, typed by a Schema

Every exported function takes **one object parameter**, and its type is a Schema type declared in a
`*.schema.ts` (or a package's `…Schema` export):

```ts
// highlight.schema.ts
export const MapCodeToHighlightTokensInput = Schema.Struct({ code: Schema.String, language: Schema.optionalKey(Language) })
export type MapCodeToHighlightTokensInput = typeof MapCodeToHighlightTokensInput.Type

// highlight.pure.ts
export const mapCodeToHighlightTokens = ({ code, language = "ts" }: MapCodeToHighlightTokensInput) => …
```

- The Schema is the input's type; nothing is decoded per call. Code at a boundary can decode with it.
- A generic function (`<A>({ values }: { readonly values: ReadonlyArray<A> })`) can't have a Schema
  input, so it only needs the single object parameter.
- Private helpers and callbacks inside the file are exempt.

## Three pure kinds

| file                  | holds                 | names                    |
| :-------------------- | :-------------------- | :----------------------- |
| `*.pure.ts`           | getters and composers | `get…`, `compose…`       |
| `*.pure.map.ts`       | mappers               | `mapXToY`                |
| `*.pure.predicate.ts` | predicates            | `is…`, `has…`, `should…` |

Each has a colocated test named after it: `x.pure.map.ts` → `x.pure.map.test.ts`. Naming is
checked by `+rule/function-names/function-names.md`.

## ✅

```ts good
import type { GetDoubleInput } from "./double.schema.ts"

const factor = 2
export const getDouble = ({ value }: GetDoubleInput) => value * factor
export const getFirst = <A>({ values }: { readonly values: ReadonlyArray<A> }) => values[0]
```

## ❌ positional parameters → pure-files/object-input

```ts bad
import type { GetSumInput } from "./sum.schema.ts"

export const getSum = (a: number, b: number) => a + b
export const getTotal = ({ values }: GetSumInput) => values.length
```

## ❌ an inline input type → pure-files/schema-input

```ts bad
export const getDouble = ({ value }: { readonly value: number }) => value * 2
```

## ❌ exports a value → pure-files/functions

```ts bad
export const sizes = ["sm", "md"] as const
export const getFirst = () => sizes[0]
```

## ❌ no test next to it → pure-files/tested

```ts bad untested
import type { GetHalfInput } from "./half.schema.ts"

export const getHalf = ({ value }: GetHalfInput) => value / 2
```

## ❌ ambient effect → pure-files/effects

```ts bad
import type { GetLogInput } from "./log.schema.ts"

export const getLog = ({ text }: GetLogInput) => console.log(text)
```

## ❌ non-determinism → pure-files/effects

```ts bad
export const getStamp = () => Date.now()
```

## ❌ module state → pure-files/effects

```ts bad
let count = 0
export const getNext = () => count + 1
```

## ❌ a component → pure-files/no-component

```ts bad
import { Html } from "@effect/ui/html"
export const Card = Html.component({ name: "Card" })
```
