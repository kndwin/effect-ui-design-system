# rule: file kinds

Every file under `packages/*/src`, `packages/themes/*/src`, `apps/*/src` and `test/` is one of
these kinds. Each kind with a rule has `+rule/<kind>/<kind>.md` in its folder or an ancestor, and
lint fails without one.

| file                                                         | what it holds                              | rule                                       |
| :----------------------------------------------------------- | :----------------------------------------- | :----------------------------------------- |
| `*.component.ts`                                             | UI: an `Html.component` or a view function | `+rule/component/component.md`             |
| `*.component.style.ts`                                       | only `Style.make(Parts)({…})`, tokens only | `+rule/component.style/component.style.md` |
| `*.token.ts`                                                 | the token contract                         | `+rule/token/token.md`                     |
| `*.theme.ts`                                                 | only `Theme.make(Tokens, …)`               | `+rule/theme/theme.md`                     |
| `*.make.ts`                                                  | a module's interface: exports `make`       | `+rule/make/make.md`                       |
| `*.pure.ts`                                                  | pure functions and data                    | `+rule/pure/pure.md`                       |
| `*.pure.test.ts`                                             | the test for the `*.pure.ts` next to it    | `+rule/test/test.md`                       |
| `*.build.ts`                                                 | build-time Node code (the CSS engine)      | `+rule/build/build.md`                     |
| `*.d.ts`                                                     | type declarations                          |                                            |
| `test/*.test.ts`, `test/*.test-d.ts`, `test/**/*.fixture.ts` | tests and their inputs                     | `+rule/test/test.md`                       |
| `main.ts`                                                    | an app's entry (`apps/*` only)             |                                            |

Also:

- **no barrels.** No `index.ts`, and no `export … from "…"`. Packages list each module in
  `package.json` `exports`.

## Rule folders

A rule lives in `+rule/<rule>/` next to the code it covers, as up to three files:

- `<rule>.md`: the contract, for people and agents. Its ✅/❌ examples are the rule tests.
- `<rule>.yml`: shape checks (ast-grep).
- `<rule>.lint.ts`: checks that need code (oxlint, via effect-oxlint).

A rule covers files of its kind in the folder that holds `+rule/`, and below.

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
