// Every file under examples/<component>/ is both a live example and its own source listing.
import type { Html } from "@effect/ui/html"
import type { Child } from "@effect/ui/View"

/** An example is any Html.component that takes no props; the docs embed it with a key. */
type Embeddable = <Msg>(h: Html.H<Msg>, options: { readonly key: string }) => Child<Msg>

interface ExampleModule {
  readonly default: Embeddable
  readonly title?: string
}

const modules = import.meta.glob<ExampleModule>("./examples/*/*.ts", { eager: true })
const sources = import.meta.glob<string>("./examples/*/*.ts", { eager: true, query: "?raw", import: "default" })

export interface Example {
  readonly id: string
  readonly page: string
  readonly title: string
  readonly component: ExampleModule["default"]
  readonly source: string
}

export const examples: ReadonlyArray<Example> = Object.entries(modules).map(([path, mod]) => {
  const [, page, file] = path.match(/\.\/examples\/([^/]+)\/([^/]+)\.ts$/)!
  return { id: `${page}-${file}`, page: page!, title: mod.title ?? file!, component: mod.default, source: sources[path]! }
})
