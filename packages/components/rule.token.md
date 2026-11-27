# rule: `*.token.ts`

A token file is the **contract**: token names and kinds, no values. Themes (`*.theme.ts`)
supply the values. `Theme.make` doesn't compile unless a theme fills in every key.

## Shape (ast-grep: `token-exports-tokens`)

- each export is a group made by a kind module: `TokenColor.make("color", ["surface", …])`,
  `TokenLength.make(...)`, `TokenFont.make(...)`, `TokenWeight.make(...)`,
  `TokenShadow.make(...)`, `TokenDuration.make(...)`
- plus one object that gathers the groups: `export const Tokens = { Colors, Spacing, … }`
- data only (`rule.pure.md`), and only `@acme/*` imports

## Changing it

🔒 This file is locked. Adding, renaming or removing a token changes every theme and every
component. Ask before you change it.
