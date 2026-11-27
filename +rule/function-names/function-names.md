# rule: function names

A function's name says what kind of thing it is, and the file kind it lives in decides which
names are allowed. Read a call site and you know what it does without opening the file.

| file                  | exported functions are named                                        | e.g.                                                  |
| :-------------------- | :------------------------------------------------------------------ | :---------------------------------------------------- |
| `*.pure.ts`           | `get…` derives or looks up a value; `compose…` builds new data      | `getThemeVars`, `getStyleClasses`, `composeRecipe`    |
| `*.pure.map.ts`       | `mapXToY`: turns one representation into another                    | `mapStyleRuleToCssRules`, `mapNameToInitials`         |
| `*.pure.predicate.ts` | `is…`, `has…`, `should…`: answers yes or no                         | `isStyleDefinition`, `isCustomized`, `isInScope`      |
| `*.make.ts`           | `make`, or `make…` for another constructor                          | `Theme.make`, `Variant.makeFlag`, `Kit.makeSingle`    |
| `*.build.ts`          | `make`, `load`, `run`, `compile`, `watch` or `scan`, for Effects    | `compileFile`, `loadPlugin`, `makeLayer`, `scan`      |
| `*.component.ts`      | a PascalCase component, or `on…` for a handler                      | `Button`, `HStack`, `onPressed`                       |
| `*.schema.ts`         | every export is a Schema named `…Schema`; its type drops the suffix | `PageSchema` and `type Page = typeof PageSchema.Type` |

`get` versus `map`: a mapper only converts its input (`StyleRule` → CSS text, a name → initials).
A getter derives something using other data, such as tokens, themes or a lookup table. When in
doubt, if the name reads naturally as `mapXToY`, it's a mapper.

Names follow [the naming cheatsheet](https://github.com/kettanaito/naming-cheatsheet): action,
then high context, then low context, with no contractions. `set`, `reset`, `remove`, `delete`
and `handle` change things, so they never name a pure function.

## ✅ a mapper

```ts good path=packages/__rules__/src/initials.pure.map.ts
import type { MapNameToInitialsInput } from "./initials.schema.ts"

export const mapNameToInitials = ({ name }: MapNameToInitialsInput) => name.slice(0, 2)
```

## ✅ a Schema

```ts good path=packages/__rules__/src/page.schema.ts
import { Schema } from "effect"

export const PageSchema = Schema.Struct({ id: Schema.String })
export type Page = typeof PageSchema.Type
```

## ❌ a getter in a map file → function-names/prefix

```ts bad path=packages/__rules__/src/name.pure.map.ts
import type { NameInput } from "./name.schema.ts"

export const getInitials = ({ name }: NameInput) => name.slice(0, 2)
```

## ❌ a mapper in a predicate file → function-names/prefix

```ts bad path=packages/__rules__/src/scope.pure.predicate.ts
import type { ScopeInput } from "./scope.schema.ts"

export const mapPathToScope = ({ path }: ScopeInput) => path.length > 0
```

## ❌ a helper in a make file → function-names/prefix

```ts bad path=packages/__rules__/src/point.make.ts
export const make = (x: number) => ({ x })
export const flag = () => make(0)
```

## ❌ a Schema without the suffix → function-names/schema-suffix

```ts bad path=packages/__rules__/src/card.schema.ts
import { Schema } from "effect"

export const Page = Schema.Struct({ id: Schema.String })
```
