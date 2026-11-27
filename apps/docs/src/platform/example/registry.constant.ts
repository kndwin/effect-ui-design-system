import { Component } from "@effect/ui"
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Order, Record } from "effect"
import { mapSourceToExampleMeta } from "./example.pure.map.ts"

const modules = import.meta.glob<Component.Any>("./catalog/*/*.component.ts", { import: "default" })
const sources = import.meta.glob<string>("./catalog/*/*.component.ts", {
  eager: true,
  query: "?raw",
  import: "default"
})

const makeExample = (id: string, path: string) => {
  const Lazy = Component.lazy(id, () => modules[path]!())
  return <Msg>(h: Html.H<Msg>, options: { readonly key: string }): Child<Msg> =>
    Lazy(h, {
      key: options.key,
      props: {},
      fallback: () => h.span.attr("aria-busy", "true").children("Loading…")
    }) as Child<Msg>
}

export interface Example {
  readonly id: string
  readonly page: string
  readonly title: string
  readonly order: number

  readonly file: string
  readonly component: ReturnType<typeof makeExample>
  readonly source: string
}

const byOrder = Order.mapInput(Order.Number, (e: Example) => e.order)

export const examples: ReadonlyArray<Example> = Array.sort(
  Array.map(Record.toEntries(sources), ([path, source]): Example => {
    const [, page, file] = path.match(/\.\/catalog\/([^/]+)\/([^/]+)\.component\.ts$/)!
    const id = `${page}-${file}`
    return {
      id,
      page: page!,
      ...mapSourceToExampleMeta({ source, file: file! }),
      file: path.slice(2),
      component: makeExample(id, path),
      source
    }
  }),
  byOrder
)
