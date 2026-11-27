# rule: `*.theme.ts`

A theme file **fills in the token contract**: `Theme.make(Tokens, { name, values, modes })`.
That is its only export (ast-grep: `theme-exports-theme`).

- `values` must cover every key of every group. Otherwise it doesn't compile.
- `modes` (e.g. `dark`) override any subset.
- each value is decoded by its kind's Schema at build time. A bad value fails the build with
  the theme, mode and path, e.g. `Theme "astryx" (dark): Colors.accent: expected #hex…`.
- the build writes `[data-theme="<name>"]` and `[data-theme="<name>"][data-mode="<mode>"]`
  rules. With `default: true` it also writes `:root`.
- data only (`rule.pure.md`), and only `@acme/*` imports
