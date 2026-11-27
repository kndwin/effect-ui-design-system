import { Button } from "@weft/components/button"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Option, Order, Record, Schema } from "effect"

export const title = "Column browser"
export const order = 1

const nodes = {
  root: { name: "weft", parent: null, folder: true, size: "", modified: "" },
  apps: { name: "apps", parent: "root", folder: true, size: "", modified: "" },
  packages: { name: "packages", parent: "root", folder: true, size: "", modified: "" },
  readme: { name: "README.md", parent: "root", folder: false, size: "9 KB", modified: "Today, 13:20" },
  logo: { name: "logo.svg", parent: "root", folder: false, size: "1 KB", modified: "Today, 12:58" },
  docs: { name: "docs", parent: "apps", folder: true, size: "", modified: "" },
  alchemy: { name: "alchemy.run.ts", parent: "docs", folder: false, size: "1 KB", modified: "Yesterday" },
  build: { name: "docs.build.ts", parent: "docs", folder: false, size: "2 KB", modified: "Mon" },
  components: { name: "components", parent: "packages", folder: true, size: "", modified: "" },
  design: { name: "design-system", parent: "packages", folder: true, size: "", modified: "" },
  engine: { name: "css-engine", parent: "packages", folder: true, size: "", modified: "" },
  contract: { name: "contract.token.ts", parent: "components", folder: false, size: "3 KB", modified: "Today, 11:02" },
  button: { name: "button.component.ts", parent: "components", folder: false, size: "2 KB", modified: "Tue" },
  style: { name: "style.make.ts", parent: "design", folder: false, size: "4 KB", modified: "Last week" },
  theme: { name: "theme.make.ts", parent: "design", folder: false, size: "5 KB", modified: "Last week" },
  vite: { name: "vite.build.ts", parent: "engine", folder: false, size: "6 KB", modified: "Oct 30" }
} as const

type NodeId = keyof typeof nodes

const ids = Record.keys(nodes) as ReadonlyArray<NodeId>

const byFolderThenName = Order.combine(
  Order.mapInput(Order.Boolean, (id: NodeId) => !nodes[id].folder),
  Order.mapInput(Order.String, (id: NodeId) => nodes[id].name)
)

const getChildren = (parent: NodeId) =>
  Array.sort(
    Array.filter(ids, (id) => nodes[id].parent === parent),
    byFolderThenName
  )

const Msg = UiSchema.TaggedEnum({
  Opened: { depth: Schema.Number, id: Schema.String },
  Selected: { id: Schema.String },
  Climbed: { depth: Schema.Number }
})

export default Html.component({
  name: "FileExplorerBrowser",
  model: Schema.Struct({ path: Schema.Array(Schema.String), selected: Schema.NullOr(Schema.String) }),
  message: Msg
}).make({
  init: () => ({ path: ["root", "packages", "components"], selected: "contract" }),
  update: {
    Opened: ($, { depth, id }) => $.evolve({ path: [...$.model.path.slice(0, depth + 1), id], selected: null }),
    Selected: ($, { id }) => $.evolve({ selected: id }),
    Climbed: ($, { depth }) => $.evolve({ path: $.model.path.slice(0, depth + 1), selected: null })
  },
  view: (h, model) => {
    const path = Array.filter(model.path, (id: string): id is NodeId => id in nodes)
    const selected = Option.fromNullishOr(model.selected).pipe(
      Option.filter((id): id is NodeId => id in nodes),
      Option.map((id) => nodes[id])
    )
    const column = (parent: NodeId, depth: number) =>
      Section(h.div, { surface: "card", pad: "2", gap: "1" })
        .key(`column-${parent}`)
        .attr("role", "list")
        .attr("aria-label", nodes[parent].name)
        .attr("style", "flex:1 1 10rem;min-width:10rem")
        .children(
          ...getChildren(parent).map((id) =>
            Button(h, {
              tone: "ghost",
              size: "sm",
              fill: true,
              pressed: path[depth + 1] === id || model.selected === id,
              onPress: Match.value(nodes[id].folder).pipe(
                Match.when(true, () => Msg.Opened({ depth, id })),
                Match.orElse(() => Msg.Selected({ id }))
              ),
              children: [
                HStack(h.span, { justify: "between", gap: "2" })
                  .attr("style", "width:100%")
                  .children(
                    Text(h.span, { size: "sm", truncate: true }).children(
                      Match.value(nodes[id].folder).pipe(
                        Match.when(true, () => `▸ ${nodes[id].name}`),
                        Match.orElse(() => nodes[id].name)
                      )
                    ),
                    Text(h.span, { size: "xs", tone: "muted" }).children(nodes[id].size)
                  )
              ]
            })
          )
        )
    return VStack(h.div, { gap: "3" })
      .attr("style", "width:100%")
      .children(
        HStack(h.nav, { gap: "1", align: "center", wrap: true })
          .attr("aria-label", "Breadcrumb")
          .children(
            ...path.flatMap((id, depth) => [
              Match.value(depth).pipe(
                Match.when(0, () => h.span),
                Match.orElse(() =>
                  Text(h.span, { size: "sm", tone: "muted" }).attr("aria-hidden", "true").children("/")
                )
              ),
              Button(h, {
                tone: "ghost",
                size: "sm",
                pressed: depth === path.length - 1,
                onPress: Msg.Climbed({ depth }),
                children: nodes[id].name
              })
            ])
          ),
        HStack(h.div, { gap: "2", align: "start", wrap: true }).children(
          ...path.map((id, depth) => column(id, depth)),
          StackItem(Section(h.aside, { surface: "muted", pad: "4", gap: "3" }), { grow: true })
            .attr("style", "flex-basis:12rem")
            .children(
              ...Option.match(selected, {
                onNone: () => [Text(h.p, { size: "sm", tone: "muted" }).children("Select a file to see its details.")],
                onSome: (file) => [
                  Text(h.h3, { weight: "semibold" }).children(file.name),
                  Separator(h),
                  ...[
                    ["Kind", file.name.split(".").pop()?.toUpperCase() ?? "File"],
                    ["Size", file.size],
                    ["Modified", file.modified],
                    ["Where", path.map((id) => nodes[id].name).join(" / ")]
                  ].map(([label, value]) =>
                    VStack(h.div, { gap: "0" }).children(
                      Text(h.span, { size: "xs", tone: "muted" }).children(label ?? ""),
                      Text(h.span, { size: "sm" }).children(value ?? "")
                    )
                  ),
                  HStack(h.div, { gap: "2" }).children(
                    Button(h, { size: "sm", tone: "primary", children: "Open" }),
                    Button(h, { size: "sm", children: "Download" })
                  )
                ]
              })
            )
        )
      )
  }
})
