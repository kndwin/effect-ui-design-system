# rule: no ternaries

Code never uses `a ? b : c`. Every branch that produces a value goes through `Match` from
`effect`, so each case is named and, on a union, `Match.exhaustive` proves none is missing.

| instead of                              | write                                                                                |
| :-------------------------------------- | :----------------------------------------------------------------------------------- |
| `done ? "Done" : "Todo"`                | `Match.value(done).pipe(Match.when(true, () => "Done"), Match.orElse(() => "Todo"))` |
| `x === undefined ? a : b(x)`            | `Match.value(x).pipe(Match.when(undefined, () => a), Match.orElse(b))`               |
| `tab === "a" ? 1 : tab === "b" ? 2 : 3` | `Match.value(tab).pipe(Match.when("a", () => 1), Match.when("b", () => 2), …)`       |

- On a union, finish with `Match.exhaustive`; otherwise with `Match.orElse`.
- A value that may be falsy but isn't a boolean matches with `Match.when(Predicate.isTruthy, …)`.
- Type-level conditionals (`T extends U ? X : Y`) are types, not branches, and are allowed.
- `if` statements are fine where a branch returns early or yields in a generator.

## ✅

```ts good
import { Match } from "effect"

export const label = (done: boolean) =>
  Match.value(done).pipe(
    Match.when(true, () => "Done"),
    Match.orElse(() => "Todo")
  )
export type Label<T> = T extends true ? "Done" : "Todo"
```

## ❌ a ternary → no-ternary/use-match

```ts bad
export const label = (done: boolean) => (done ? "Done" : "Todo")
```
