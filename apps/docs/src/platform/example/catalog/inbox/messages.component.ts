import { Avatar } from "@weft/components/avatar"
import { Button } from "@weft/components/button"
import { Field } from "@weft/components/field"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { ToggleGroup } from "@weft/components/toggle-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Option, Schema, String } from "effect"

export const title = "Inbox with reading pane"
export const order = 1

const MessageSchema = Schema.Struct({
  id: Schema.String,
  from: Schema.String,
  subject: Schema.String,
  body: Schema.String,
  time: Schema.String,
  unread: Schema.Boolean
})

const Msg = UiSchema.TaggedEnum({
  Searched: { value: Schema.String },
  Filtered: { value: Schema.Array(Schema.String) },
  Opened: { id: Schema.String },
  ToggledRead: {},
  Archived: {},
  UpdatedReply: { value: Schema.String },
  Sent: {}
})

const initialMessages = [
  {
    id: "1",
    from: "Grace Hopper",
    subject: "Compiler review on Thursday",
    body: "Could you look over the new parser before Thursday? I left notes on the error recovery path.",
    time: "09:41",
    unread: true
  },
  {
    id: "2",
    from: "Alan Turing",
    subject: "Re: Q4 planning",
    body: "Agreed on the roadmap. Let's move the theme builder up and push the chart work to January.",
    time: "08:15",
    unread: true
  },
  {
    id: "3",
    from: "Katherine Johnson",
    subject: "Launch window numbers",
    body: "Attached are the final trajectory tables. The second window has a much wider margin.",
    time: "Yesterday",
    unread: false
  },
  {
    id: "4",
    from: "Margaret Hamilton",
    subject: "Release notes draft",
    body: "First pass at the release notes is up. Mostly the rename and the new templates.",
    time: "Mon",
    unread: false
  }
]

export default Html.component({
  name: "InboxMessages",
  model: Schema.Struct({
    messages: Schema.Array(MessageSchema),
    query: Schema.String,
    unreadOnly: Schema.Boolean,
    selected: Schema.NullOr(Schema.String),
    reply: Schema.String,
    sent: Schema.Array(Schema.String)
  }),
  message: Msg
}).make({
  init: () => ({ messages: initialMessages, query: "", unreadOnly: false, selected: "1", reply: "", sent: [] }),
  update: {
    Searched: ($, { value }) => $.evolve({ query: value }),
    Filtered: ($, { value }) => $.evolve({ unreadOnly: value.includes("unread") }),
    Opened: ($, { id }) =>
      $.evolve({
        selected: id,
        reply: "",
        messages: (messages) => messages.map((m) => ({ ...m, unread: m.unread && m.id !== id }))
      }),
    ToggledRead: ($) =>
      $.evolve({
        messages: (messages) => messages.map((m) => ({ ...m, unread: m.unread !== (m.id === $.model.selected) }))
      }),
    Archived: ($) =>
      $.evolve({ messages: (messages) => messages.filter((m) => m.id !== $.model.selected), selected: null }),
    UpdatedReply: ($, { value }) => $.evolve({ reply: value }),
    Sent: ($) =>
      Match.value(String.isNonEmpty($.model.reply.trim())).pipe(
        Match.when(true, () => $.evolve({ sent: (sent) => [...sent, $.model.reply], reply: "" })),
        Match.orElse(() => $.model)
      )
  },
  view: (h, model) => {
    const query = model.query.toLowerCase()
    const shown = model.messages.filter(
      (m) =>
        (!model.unreadOnly || m.unread) &&
        (m.from.toLowerCase().includes(query) || m.subject.toLowerCase().includes(query))
    )
    const unreadCount = model.messages.filter((m) => m.unread).length
    const selected = Array.findFirst(model.messages, (m) => m.id === model.selected)
    return HStack(h.div, { gap: "4", align: "start", wrap: true })
      .attr("style", "width:100%")
      .children(
        StackItem(Section(h.div, { surface: "card", pad: "3", gap: "3" }), { grow: true })
          .attr("style", "flex-basis:16rem")
          .children(
            HStack(h.div, { justify: "between", align: "center", gap: "2" }).children(
              Text(h.h2, { size: "lg", weight: "semibold" }).children("Inbox"),
              Text(h.span, { size: "xs", tone: "muted" }).children(`${unreadCount} unread`)
            ),
            Field(h, {
              key: "search",
              label: "Search",
              placeholder: "Sender or subject",
              value: model.query,
              onUpdate: ({ value }) => Msg.Searched({ value })
            }),
            ToggleGroup(h, {
              key: "filter",
              label: "Show",
              size: "sm",
              items: [{ value: "unread", label: "Unread only" }],
              value: Match.value(model.unreadOnly).pipe(
                Match.when(true, () => ["unread"]),
                Match.orElse(() => [])
              ),
              onToggle: ({ value }) => Msg.Filtered({ value })
            }),
            Match.value(shown.length).pipe(
              Match.when(0, () => Text(h.p, { size: "sm", tone: "muted" }).children("No messages match.")),
              Match.orElse(() =>
                VStack(h.div, { gap: "1" })
                  .attr("role", "list")
                  .attr("aria-label", "Messages")
                  .children(
                    ...shown.map((m) =>
                      Button(h, {
                        tone: "ghost",
                        fill: true,
                        pressed: m.id === model.selected,
                        onPress: Msg.Opened({ id: m.id }),
                        children: [
                          HStack(h.span, { gap: "3", align: "center" })
                            .attr("style", "width:100%;text-align:left")
                            .children(
                              Avatar(h, { name: m.from, size: "sm" }),
                              StackItem(VStack(h.span, { gap: "0" }), { grow: true })
                                .attr("style", "min-width:0")
                                .children(
                                  Text(h.span, {
                                    size: "sm",
                                    weight: Match.value(m.unread).pipe(
                                      Match.when(true, () => "semibold" as const),
                                      Match.orElse(() => "regular" as const)
                                    ),
                                    truncate: true
                                  }).children(m.from),
                                  Text(h.span, { size: "xs", tone: "muted", truncate: true }).children(m.subject)
                                ),
                              VStack(h.span, { gap: "1", align: "end" }).children(
                                Text(h.span, { size: "xs", tone: "muted" }).children(m.time),
                                Match.value(m.unread).pipe(
                                  Match.when(true, () =>
                                    Text(h.span, { size: "xs", tone: "accent" })
                                      .attr("aria-label", "Unread")
                                      .children("●")
                                  ),
                                  Match.orElse(() => h.span)
                                )
                              )
                            )
                        ]
                      })
                    )
                  )
              )
            )
          ),
        StackItem(Section(h.article, { surface: "card", pad: "4", gap: "4" }), { grow: true })
          .attr("style", "flex-basis:20rem")
          .children(
            ...Option.match(selected, {
              onNone: () => [Text(h.p, { tone: "muted" }).children("Pick a message to read it.")],
              onSome: (m) => [
                HStack(h.div, { justify: "between", align: "start", gap: "3", wrap: true }).children(
                  HStack(h.div, { gap: "3", align: "center" }).children(
                    Avatar(h, { name: m.from }),
                    VStack(h.div, { gap: "0" }).children(
                      Text(h.span, { weight: "semibold" }).children(m.from),
                      Text(h.span, { size: "xs", tone: "muted" }).children(m.time)
                    )
                  ),
                  HStack(h.div, { gap: "2" }).children(
                    Button(h, {
                      size: "sm",
                      onPress: Msg.ToggledRead(),
                      children: Match.value(m.unread).pipe(
                        Match.when(true, () => "Mark read"),
                        Match.orElse(() => "Mark unread")
                      )
                    }),
                    Button(h, { size: "sm", tone: "danger", onPress: Msg.Archived(), children: "Archive" })
                  )
                ),
                Text(h.h3, { size: "lg", weight: "semibold" }).children(m.subject),
                Text(h.p, { size: "sm" }).children(m.body),
                ...model.sent.map((text, index) =>
                  Section(h.div, { surface: "muted", pad: "3", gap: "1" })
                    .key(`sent-${index}`)
                    .children(
                      Text(h.span, { size: "xs", tone: "muted" }).children("You replied"),
                      Text(h.p, { size: "sm" }).children(text)
                    )
                ),
                Separator(h),
                Field(h, {
                  key: "reply",
                  label: `Reply to ${m.from}`,
                  value: model.reply,
                  placeholder: "Write a reply",
                  onUpdate: ({ value }) => Msg.UpdatedReply({ value })
                }),
                HStack(h.div, { justify: "end" }).children(
                  Button(h, {
                    tone: "primary",
                    disabled: model.reply.trim() === "",
                    onPress: Msg.Sent(),
                    children: "Send"
                  })
                )
              ]
            })
          )
      )
  }
})
