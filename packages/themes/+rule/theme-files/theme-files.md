# rule: theme files

A `*.theme.ts` file **fills in the token contract**. Its only export is
`Theme.make(Tokens, { name, layer, modes })`.

Each token group in the contract is an Effect `Context` key, so a theme provides values the way
an app provides services: `Layer.succeed(Tokens.Colors, { … })`, one per group, merged with
`Layer.mergeAll`.

- `layer` provides every group. Like any `Layer` requirement, a missing group doesn't compile, and
  `Layer.succeed` checks every key of the group.
- `modes` (e.g. `dark`) are layers too. A mode provides only the groups it changes, and only the
  values that differ from the base are written.
- Each value is decoded by its kind's Schema at build time. A bad value fails the build with
  the theme, mode and path, e.g. `Theme "astryx" (dark): Colors.accent: expected #hex…`.
- The build writes `[data-theme="<name>"]` and `[data-theme="<name>"][data-mode="<mode>"]`.
  With `default: true` it also writes `:root`.
- It is a data file (`+rule/pure-files/pure-files.md`) and imports only `@weft/*` and `effect`.

## ✅

```ts good
import { Tokens } from "@weft/components/tokens"
import * as Theme from "@weft/design-system/Theme"
import { Layer } from "effect"

export const brand = Theme.make(Tokens, { name: "brand", layer: Layer.empty as never })
```

## ❌ a loose value → theme-files/exports

```ts bad
export const accent = "#7c5cff"
```

## ❌ a non-@weft import → theme-files/imports

```ts bad
import { readFileSync } from "node:fs"
export const brand = readFileSync
```
