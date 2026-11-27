# rule: theme files

A `*.theme.ts` file **fills in the token contract**. Its only export is
`Theme.make(Tokens, { name, values, modes })`.

- `values` covers every key of every group. Otherwise it doesn't compile.
- `modes` (e.g. `dark`) override any subset.
- Each value is decoded by its kind's Schema at build time. A bad value fails the build with
  the theme, mode and path, e.g. `Theme "astryx" (dark): Colors.accent: expected #hex…`.
- The build writes `[data-theme="<name>"]` and `[data-theme="<name>"][data-mode="<mode>"]`.
  With `default: true` it also writes `:root`.
- It is a data file (`pure.rule.md`) and imports only `@acme/*`.

## ✅

```ts good
import { Tokens } from "@acme/components/tokens"
import * as Theme from "@acme/ds/Theme"

export const brand = Theme.make(Tokens, { name: "brand", values: {} as never })
```

## ❌ a loose value → theme/exports

```ts bad
export const accent = "#7c5cff"
```

## ❌ a non-@acme import → theme/imports

```ts bad
import { readFileSync } from "node:fs"
export const brand = readFileSync
```
