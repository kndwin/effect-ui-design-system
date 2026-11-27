import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"
import { Array, Order, Record, String } from "effect"

type Embeddable = <Msg>(h: Html.H<Msg>, options: { readonly key: string }) => Child<Msg>

interface ExampleModule {
  readonly default: Embeddable
  readonly title?: string

  readonly order?: number
}

const modules = import.meta.glob<ExampleModule>("./examples/*/*.component.ts", { eager: true })
const sources = import.meta.glob<string>("./examples/*/*.component.ts", {
  eager: true,
  query: "?raw",
  import: "default"
})

export interface Example {
  readonly id: string
  readonly page: string
  readonly title: string
  readonly order: number

  readonly file: string
  readonly component: ExampleModule["default"]
  readonly source: string
}

const byOrder = Order.mapInput(Order.Number, (e: Example) => e.order)

export const examples: ReadonlyArray<Example> = Array.sort(
  Array.map(Record.toEntries(modules), ([path, mod]): Example => {
    const [, page, file] = path.match(/\.\/examples\/([^/]+)\/([^/]+)\.component\.ts$/)!
    return {
      id: `${page}-${file}`,
      page: page!,
      title: mod.title ?? String.capitalize(file!.replaceAll("-", " ")),
      order: mod.order ?? 99,
      file: path.slice(2),
      component: mod.default,
      source: sources[path]!
    }
  }),
  byOrder
)
