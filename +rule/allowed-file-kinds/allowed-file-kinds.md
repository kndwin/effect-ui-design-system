# rule: file kinds

Every file under `packages/*/src` (laid out as `feature/` and `platform/`, see
`+rule/feature-folders/feature-folders.md`), `packages/themes/*/src`, `apps/*/src` and `test/` is one of
these kinds. Each kind with a rule has `+rule/<kind>/<kind>.md` in its folder or an ancestor, and
lint fails without one.

| file                                                                                         | what it holds                                               | rule                                                   |
| :------------------------------------------------------------------------------------------- | :---------------------------------------------------------- | :----------------------------------------------------- |
| `*.component.ts`                                                                             | UI; the rule lives in `packages/components` and `apps/docs` | `+rule/component-files/component-files.md`             |
| `*.define.ts`, `*.update.ts`, `*.view.ts`, `*.command.ts`, `*.subscription.ts`, `*.route.ts` | the parts of an `@effect/ui` component                      | `+rule/component-parts/component-parts.md`             |
| `*.component.style.ts`                                                                       | only `Style.make(Parts)({…})`, tokens only                  | `+rule/component-style-files/component-style-files.md` |
| `*.token.ts`                                                                                 | the token contract                                          | `+rule/token-files/token-files.md`                     |
| `*.theme.ts`                                                                                 | only `Theme.make(Tokens, …)`                                | `+rule/theme-files/theme-files.md`                     |
| `*.make.ts`                                                                                  | a module's interface: exports `make`                        | `+rule/make-files/make-files.md`                       |
| `*.schema.ts`                                                                                | Schemas and their types                                     | `+rule/schema-files/schema-files.md`                   |
| `*.constant.ts`                                                                              | plain values and their types                                | `+rule/constant-files/constant-files.md`               |
| `*.pure.ts`                                                                                  | pure getters and composers                                  | `+rule/pure-files/pure-files.md`                       |
| `*.pure.map.ts`                                                                              | pure mappers, `mapXToY`                                     | `+rule/pure-files/pure-files.md`                       |
| `*.pure.predicate.ts`                                                                        | pure predicates, `is…`, `has…`, `should…`                   | `+rule/pure-files/pure-files.md`                       |
| `*.pure.test.ts`, `*.pure.map.test.ts`, `*.pure.predicate.test.ts`                           | the test for the pure file next to it                       | `+rule/test-files/test-files.md`                       |
| `*.build.ts`                                                                                 | build-time Node code (the CSS engine)                       | `+rule/build-files/build-files.md`                     |
| `*.d.ts`                                                                                     | type declarations                                           |                                                        |
| `test/*.test.ts`, `test/*.test-d.ts`, `test/**/*.fixture.ts`                                 | tests and their inputs                                      | `+rule/test-files/test-files.md`                       |
| `main.ts`                                                                                    | an app's entry (`apps/*` only)                              |                                                        |

Also:

- **no barrels.** No `index.ts`, and no `export … from "…"`. Packages list each module in
  `package.json` `exports`.
- **kebab-case.** Every folder and file name is lowercase words joined by `-`:
  `feature/code-block/code-block.parts.constant.ts`, `catalog/introduction/profile-card.component.ts`.

## Rule folders

A rule lives in `+rule/<rule>/` next to the code it covers, as up to three files:

- `<rule>.md`: the contract, for people and agents. Its ✅/❌ examples are the rule tests.
- `<rule>.yml`: shape checks (ast-grep).
- `<rule>.lint.ts`: checks that need code (oxlint, via effect-oxlint).

A rule covers files of its kind in the folder that holds `+rule/`, and below.

## ✅

```ts good path=packages/__rules__/src/sizes.constant.ts
export const sizes = ["sm", "md"] as const
```

## ❌ unknown kind → allowed-file-kinds/known-kind

```ts bad path=packages/__rules__/src/helpers.ts
export const double = (n: number) => n * 2
```

## ❌ not kebab-case → allowed-file-kinds/kebab-case

```ts bad path=packages/__rules__/src/ProfileCard.component.ts
export const ProfileCard = (h: { div: unknown }) => h.div
```

## ❌ barrel → allowed-file-kinds/known-kind

```ts bad path=packages/__rules__/src/index.ts
export const all = 1
```

## ❌ re-export → allowed-file-kinds/no-reexports

```ts bad path=packages/__rules__/src/re.pure.ts
export { Badge } from "./badge.component.ts"
```
