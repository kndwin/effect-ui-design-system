# rule: types from Schemas

A data shape is declared once, as a Schema, and its type is derived from it:

```ts
export const Page = Schema.Struct({ id: Schema.String, title: Schema.String })
export type Page = typeof Page.Type
```

So in `src/` and `test/` of every package and app, outside `*.schema.ts`, there are no plain
`interface X { … }` or `type X = { … }` object shapes. Declare the Schema in a `*.schema.ts`
(`+rule/schema-files/schema-files.md`) and import its type.

Some types are not data and can't be Schemas. These stay plain types:

- generic types: `Style<Name, Slot, P>`, `Theme<Name, Mode>`, `Ref<K>`
- types with functions or methods: `ControlOption` (`getVars: (mode) => Vars`), `Classable`
- type-level helpers: computed keys, indexed access, conditional and mapped types, and instances of
  other generic types (`Meta<P, K>`, `Variant<any, any>`)
- interfaces that `extends` another type (the `Kit.Type<…>` trick that names a descriptor)
- recursive shapes, which are declared next to their Schema in the `*.schema.ts`

Unions of literals are Schemas too (`Schema.Literals([...])`); the rule doesn't check them, but the
code follows it.

## ✅

```ts good path=packages/__rules__/src/page.component.ts
import type { Html } from "@effect/ui/html"
import type { Page } from "./page.schema.ts"

export interface Embeddable {
  readonly render: <Msg>(h: Html.H<Msg>) => unknown
}
export interface Box<A> {
  readonly value: A
}
export const PageView = (page: Page) => page.id
```

## ❌ a plain data shape → types-from-schema/no-plain-shapes

```ts bad path=packages/__rules__/src/page.constant.ts
export interface Page {
  readonly id: string
  readonly title: string
}
export const home: Page = { id: "home", title: "Home" }
```
