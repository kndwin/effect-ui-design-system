# rule: pure files

A `*.pure.ts` file holds **pure functions and plain data**. Importing it does nothing, and its
functions give the same output for the same input. The other data kinds follow the same rule:
`*.make.ts`, `*.component.style.ts`, `*.token.ts` and `*.theme.ts`.

Every `*.pure.ts` has a `*.pure.test.ts` next to it (`+rule/test/test.md`).

Allowed: `const` functions, objects, Schemas, types, and imports of other pure modules and `effect`.

Not allowed:

- ambient effects: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`,
  `fetch`, `console`, `process`, `globalThis`
- non-determinism: `Math.random()`, `Date.now()`, `new Date()`
- module state: top-level `let` or `var`
- statements that run on import
- `Html.component(...)`: UI goes in a `*.component.ts`

Effects belong in a `*.component.ts` (as `Command`s run from `update`) or in `apps/*/src/main.ts`.

## ✅

```ts good
export const double = (n: number) => n * 2
export const sizes = ["sm", "md"] as const
```

## ❌ no test next to it → pure/tested

```ts bad untested
export const half = (n: number) => n / 2
```

## ❌ ambient effect → pure/effects

```ts bad
export const log = (s: string) => console.log(s)
```

## ❌ non-determinism → pure/effects

```ts bad
export const stamp = () => Date.now()
```

## ❌ module state → pure/effects

```ts bad
let count = 0
export const next = () => count + 1
```

## ❌ a component → pure/no-component

```ts bad
import { Html } from "@effect/ui/html"
export const Card = Html.component({ name: "Card" })
```
