import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"

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

export const examples: ReadonlyArray<Example> = Object.entries(modules)
  .map(([path, mod]) => {
    const [, page, file] = path.match(/\.\/examples\/([^/]+)\/([^/]+)\.component\.ts$/)!
    return {
      id: `${page}-${file}`,
      page: page!,
      title: mod.title ?? file!,
      order: mod.order ?? 99,
      file: path.slice(2),
      component: mod.default,
      source: sources[path]!
    }
  })
  .toSorted((a, b) => a.order - b.order)
