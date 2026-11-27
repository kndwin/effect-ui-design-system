# rule: `*.pure.ts`

A `.pure.ts` file holds **pure functions and plain data**. Importing it must do nothing, and
calling its functions with the same input must give the same output.

The same rule also covers the other data kinds: `*.component.style.ts`, `*.token.ts`
and `*.theme.ts`.

## Allowed

- `const` declarations: functions, objects, Schemas, lookup tables
- types and interfaces
- imports of other pure modules, `effect`, and type-only imports

## Not allowed (lint: `acme/pure`)

- ambient effects: `window`, `document`, `navigator`, `localStorage`, `sessionStorage`, `fetch`, `console`, `process`, `globalThis`
- non-determinism: `Math.random()`, `Date.now()`, `new Date()`
- module state: top-level `let` / `var`
- statements that run on import, e.g. a top-level `foo()`
- `Html.component(...)` (ast-grep: `data-has-no-component`)
- `@vanilla-extract/*` imports (`acme/vanilla-imports`). That is a build detail in `tools/vite`.

## Where effects go instead

- UI state and effects → a `*.component.ts` (an `Html.component`, with `Command`s)
- app start-up → `apps/*/src/main.ts`
