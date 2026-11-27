import { VStack } from "@weft/components/layout/stack"
import type { Html } from "@effect/ui/html"
import type { Page } from "../../platform/content/content.schema.ts"
import { ExampleBlock } from "../../platform/example/example.component.ts"
import { examples } from "../../platform/example/registry.constant.ts"
import type { Look } from "../../platform/theme/theme.schema.ts"

export const TemplatePage = <Msg>(h: Html.H<Msg>, page: Page, look: Look) => [
  VStack(h.section, { gap: "6" }).children(
    ...examples.filter((e) => e.page === page.id).map((e) => ExampleBlock(h, { id: e.id, ...look }))
  )
]
