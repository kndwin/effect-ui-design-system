# rule: token files

A `*.token.ts` file is the **contract**: token names and kinds, no values. Themes supply the
values, and `Theme.make` doesn't compile unless a theme fills in every key.

- Each export is a group made by a kind module: `TokenColor.make("color", ["surface", …])`,
  `TokenLength`, `TokenFont`, `TokenWeight`, `TokenShadow`, `TokenDuration`.
- One object gathers the groups: `export const Tokens = { Colors, Spacing, … }`.
- It is a data file (`+rule/pure-files/pure-files.md`) and imports only `@weft/*`.

🔒 This file is locked. Adding, renaming or removing a token changes every theme and every
component, so ask before you change it.

## ✅

```ts good
import * as TokenColor from "@weft/design-system/TokenColor"

export const Colors = TokenColor.make("color", ["surface", "accent"])
export const Tokens = { Colors }
```

## ❌ a value in the contract → token-files/exports

```ts bad
export const accent = "#7c5cff"
```
