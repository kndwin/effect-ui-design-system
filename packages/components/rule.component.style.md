# rule: `*.component.style.ts`

A style file **declares how a component looks, as data**. Each export is exactly one
`Style.make(Kit)({ base, variants, compound })`. ast-grep: `style-exports-style`.

The file is plain data, so `rule.pure.md` applies too. `tools/vite/acme-styles.ts` compiles it
to static CSS at build time; importers get class names.

## Values come from tokens (lint: `acme/tokens-only`)

- colours, lengths, durations, shadows, fonts and weights must be contract tokens
  (`Colors.accent`, `Spacing[4]`, `Radius.control`, …), or derived from them
  (`TokenColor.alpha(...)`, ``TokenLength.calc`...` ``)
- keywords are fine: `display`, `cursor`, `"100%"`, `"auto"`, `0`, unitless line-heights
- no raw `#hex`, `rgb()`, `oklch()`, `12px`, `1rem` or `150ms`, and no lint-disable comments

**Need a token that doesn't exist? Stop and ask.** Don't add one to `contract.token.ts`, and
don't hard-code a value.

## Shape

- slot names and `states` come from the kit (`@acme/ds/kit/*`). Unknown ones don't compile.
- every value of a variant's Schema must be styled. A missing one doesn't compile.
- imports: only `@acme/*` and local files (ast-grep: `data-imports`)
