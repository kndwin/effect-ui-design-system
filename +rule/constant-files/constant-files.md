# rule: constant files

A `*.constant.ts` file holds **values**: lookup tables, descriptors, lists of pages, ids, and the
types that describe them. It is the place for data that isn't a Schema and isn't a function.

```ts
export const breakpoints = { narrow: "screen and (max-width: 860px)" } as const
export type Breakpoint = keyof typeof breakpoints
```

- No exported functions or classes. A function goes in a `*.pure.ts`; a Schema in a `*.schema.ts`.
- A value may be computed by a call (`Kit.single("Stack")`), as long as the result is data.
- It is a data module, so `+rule/pure-files/pure-files.md` applies. It has no logic of its own, so it needs no
  colocated test; check its shape from `test/` when it matters.

## ✅

```ts good
export const sizes = ["sm", "md"] as const
export type Size = (typeof sizes)[number]
export const labels = { sm: "Small", md: "Medium" } satisfies Record<Size, string>
```

## ❌ a function → constant-files/no-functions

```ts bad
export const sizes = ["sm", "md"] as const
export const label = (s: string) => s.toUpperCase()
```

## ❌ a class → constant-files/no-functions

```ts bad
export class Sizes {}
```
