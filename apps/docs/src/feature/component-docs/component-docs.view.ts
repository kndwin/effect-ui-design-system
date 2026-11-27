import { VStack } from "@weft/components/layout/stack"
import type { Html } from "@effect/ui/html"
import type { Page } from "../../platform/content/content.schema.ts"
import { ExampleBlock } from "../../platform/example/example.component.ts"
import { examples } from "../../platform/example/registry.constant.ts"
import type { Look } from "../../platform/theme/theme.schema.ts"
import { Blocks } from "../../platform/ui/blocks.view.ts"
import { Heading } from "../../platform/ui/ui.view.ts"
import { getInstallationSection } from "./component-docs.pure.ts"

export const ComponentDocsPage = <Msg>(h: Html.H<Msg>, page: Page, look: Look) => [
  VStack(h.section, { gap: "4" }).children(
    Heading(h, "Examples"),
    ...examples.filter((e) => e.page === page.id).map((e) => ExampleBlock(h, { id: e.id, ...look }))
  ),
  VStack(h.section, { gap: "3" }).children(
    Heading(h, "Installation"),
    ...Blocks(h, `installation-${page.id}`, getInstallationSection({ page }).blocks, false)
  )
]
