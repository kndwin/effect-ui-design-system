# rule: file kinds

Every file under `packages/*/src`, `packages/themes/*/src`, `apps/*/src` and `test/` is one of
these kinds. Each kind with a rule has a `<kind>.rule.md` in its folder or an ancestor, and lint
fails without one.

| file                                                         | what it holds                              | rule                      |
| :----------------------------------------------------------- | :----------------------------------------- | :------------------------ |
| `*.component.ts`                                             | UI: an `Html.component` or a view function | `component.rule.md`       |
| `*.component.style.ts`                                       | only `Style.make(Kit)({…})`, tokens only   | `component.style.rule.md` |
| `*.token.ts`                                                 | the token contract                         | `token.rule.md`           |
| `*.theme.ts`                                                 | only `Theme.make(Tokens, …)`               | `theme.rule.md`           |
| `*.pure.ts`                                                  | pure functions and data                    | `pure.rule.md`            |
| `*.build.ts`                                                 | build-time Node code (the CSS engine)      | `build.rule.md`           |
| `*.d.ts`                                                     | type declarations                          |                           |
| `test/*.test.ts`, `test/*.test-d.ts`, `test/**/*.fixture.ts` | tests and their inputs                     |                           |
| `main.ts`                                                    | an app's entry (`apps/*` only)             |                           |

Also:

- **no barrels.** No `index.ts`, and no `export … from "…"`. Packages list each module in
  `package.json` `exports`.
- **vanilla-extract only in `*.build.ts`.** It is a detail of `@acme/css-engine`.

## Rule files

A kind's rule lives next to where it applies, as up to three files:

- `<kind>.rule.md`: the contract, for people and agents. Its ✅/❌ examples are the rule tests.
- `<kind>.rule.yml`: shape checks (ast-grep).
- `<kind>.rule.ts`: checks that need code (oxlint, via effect-oxlint).

A rule covers files of its kind in its own folder and below.

## ✅

```ts good path=packages/__rules__/src/badge.component.ts
export const Badge = (h: { span: unknown }) => h.span
```

## ❌ unknown kind → file-kind/allowed

```ts bad path=packages/__rules__/src/helpers.ts
export const double = (n: number) => n * 2
```

## ❌ barrel → file-kind/allowed

```ts bad path=packages/__rules__/src/index.ts
export const all = 1
```

## ❌ re-export → file-kind/no-reexports

```ts bad path=packages/__rules__/src/re.pure.ts
export { Badge } from "./badge.component.ts"
```

## ❌ vanilla-extract outside the engine → file-kind/vanilla-imports

```ts bad path=packages/__rules__/src/look.pure.ts
import { style } from "@vanilla-extract/css"
export const look = style
```
