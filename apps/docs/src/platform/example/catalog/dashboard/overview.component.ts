import { Avatar } from "@weft/components/avatar"
import { Button } from "@weft/components/button"
import { Grid } from "@weft/components/layout/grid"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Meter } from "@weft/components/meter"
import { Progress } from "@weft/components/progress"
import { Select } from "@weft/components/select"
import { Tabs } from "@weft/components/tabs"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Schema } from "effect"

export const title = "Analytics overview"
export const order = 1

const RangeSchema = Schema.Literals(["7d", "30d", "90d"])
type Range = typeof RangeSchema.Type

const Msg = UiSchema.TaggedEnum({
  PickedRange: { value: Schema.NullOr(Schema.String) },
  PickedFeed: { value: Schema.String },
  Exported: {}
})

const stats: Record<Range, ReadonlyArray<readonly [label: string, value: string, delta: string, up: boolean]>> = {
  "7d": [
    ["Revenue", "$12,480", "+4.2%", true],
    ["Active users", "3,214", "+1.8%", true],
    ["Conversion", "2.9%", "-0.3%", false],
    ["Churn", "0.8%", "-0.1%", true]
  ],
  "30d": [
    ["Revenue", "$54,120", "+11.6%", true],
    ["Active users", "9,860", "+6.1%", true],
    ["Conversion", "3.1%", "+0.4%", true],
    ["Churn", "1.2%", "+0.2%", false]
  ],
  "90d": [
    ["Revenue", "$148,900", "+23.0%", true],
    ["Active users", "21,402", "+14.7%", true],
    ["Conversion", "3.0%", "+0.1%", true],
    ["Churn", "1.1%", "-0.4%", true]
  ]
}

const goals: Record<Range, ReadonlyArray<readonly [label: string, value: number]>> = {
  "7d": [
    ["Weekly revenue target", 62],
    ["New sign-ups", 81],
    ["Support replies under 1h", 94]
  ],
  "30d": [
    ["Monthly revenue target", 74],
    ["New sign-ups", 58],
    ["Support replies under 1h", 91]
  ],
  "90d": [
    ["Quarterly revenue target", 88],
    ["New sign-ups", 67],
    ["Support replies under 1h", 89]
  ]
}

const activity = [
  { who: "Grace Hopper", what: "upgraded to the Team plan", when: "2m ago", mention: false },
  { who: "Alan Turing", what: "mentioned you in Q4 planning", when: "18m ago", mention: true },
  { who: "Katherine Johnson", what: "invited 3 teammates", when: "1h ago", mention: false },
  { who: "Margaret Hamilton", what: "mentioned you in Release notes", when: "3h ago", mention: true }
]

export default Html.component({
  name: "DashboardOverview",
  model: Schema.Struct({ range: RangeSchema, feed: Schema.String, exported: Schema.Boolean }),
  message: Msg
}).make({
  init: () => ({ range: "30d" as const, feed: "all", exported: false }),
  update: {
    PickedRange: ($, { value }) =>
      Match.value(value).pipe(
        Match.when(Schema.is(RangeSchema), (range) => $.evolve({ range, exported: false })),
        Match.orElse(() => $.model)
      ),
    PickedFeed: ($, { value }) => $.evolve({ feed: value }),
    Exported: ($) => $.evolve({ exported: true })
  },
  view: (h, model) => {
    const feed = (mentionsOnly: boolean) =>
      VStack(h.ul, { gap: "3" })
        .attr("style", "margin:0;padding:0;list-style:none")
        .children(
          ...Array.filter(activity, (item) => !mentionsOnly || item.mention).map((item) =>
            HStack(h.li, { gap: "3", align: "center" }).children(
              Avatar(h, { name: item.who, size: "sm" }),
              StackItem(Text(h.span, { size: "sm" }), { grow: true }).children(
                Text(h.strong, { weight: "medium" }).children(item.who),
                ` ${item.what}`
              ),
              Text(h.span, { size: "xs", tone: "muted" }).children(item.when)
            )
          )
        )
    return VStack(h.div, { gap: "6" })
      .attr("style", "width:100%")
      .children(
        HStack(h.div, { justify: "between", align: "end", gap: "3", wrap: true }).children(
          VStack(h.div, { gap: "1" }).children(
            Text(h.h2, { size: "xl", weight: "semibold" }).children("Overview"),
            Text(h.p, { size: "sm", tone: "muted" }).children("How the business is doing, at a glance.")
          ),
          HStack(h.div, { gap: "2", align: "end" }).children(
            Select(h, {
              key: "range",
              label: "Range",
              value: model.range,
              items: [
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" }
              ],
              onPick: ({ value }) => Msg.PickedRange({ value })
            }),
            Button(h, {
              onPress: Msg.Exported(),
              children: Match.value(model.exported).pipe(
                Match.when(true, () => "Exported"),
                Match.orElse(() => "Export")
              )
            })
          )
        ),
        Grid(h.div, { columns: "4", gap: "3", stack: true }).children(
          ...stats[model.range].map(([label, value, delta, up]) =>
            Section(h.div, { surface: "card", pad: "4", gap: "1" }).children(
              Text(h.span, { size: "sm", tone: "muted" }).children(label),
              Text(h.span, { size: "2xl", weight: "semibold" }).children(value),
              Text(h.span, {
                size: "xs",
                tone: Match.value(up).pipe(
                  Match.when(true, () => "accent" as const),
                  Match.orElse(() => "danger" as const)
                )
              }).children(`${delta} vs previous period`)
            )
          )
        ),
        Grid(h.div, { columns: "2", gap: "3", stack: true }).children(
          Section(h.div, { surface: "card", pad: "4", gap: "4" }).children(
            Text(h.h3, { weight: "semibold" }).children("Goals"),
            ...goals[model.range].map(([label, value]) =>
              Progress(h, { key: label, label, value, valueText: `${value}%` })
            ),
            Meter(h, { key: "seats", label: "Seats used", value: 42, max: 50, valueText: "42 of 50" })
          ),
          Section(h.div, { surface: "card", pad: "4", gap: "3" }).children(
            Text(h.h3, { weight: "semibold" }).children("Activity"),
            Tabs(h, {
              key: "feed",
              label: "Activity feed",
              value: model.feed,
              onSelect: ({ value }) => Msg.PickedFeed({ value }),
              tabs: [
                { value: "all", label: "All", content: [feed(false)] },
                { value: "mentions", label: "Mentions", content: [feed(true)] }
              ]
            })
          )
        )
      )
  }
})
