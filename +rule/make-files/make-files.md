# rule: make files

A `*.make.ts` file is a module's **interface**: it exports a `make` constructor, plus the types
and companion constructors that go with it. Callers import it as a namespace:

```ts
import * as TokenColor from "@weft/design-system/TokenColor"
TokenColor.make("color", ["accent"])
```

- It must export `const make`.
- It is a data module, so `+rule/pure-files/pure-files.md` applies: no effects at import or call time.
- File names are kebab-case and say what they make: `tokens/token-color.make.ts`, `theme/theme.make.ts`.

## ✅

```ts good
export interface Point {
  readonly x: number
  readonly y: number
}
export const make = (x: number, y: number): Point => ({ x, y })
```

## ❌ no make → make-files/exports-make

```ts bad
export const point = (x: number, y: number) => ({ x, y })
```
