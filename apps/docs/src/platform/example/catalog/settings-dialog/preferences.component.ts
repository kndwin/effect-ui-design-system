import { Button } from "@weft/components/button"
import { Dialog } from "@weft/components/dialog"
import { Field } from "@weft/components/field"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { RadioGroup } from "@weft/components/radio-group"
import { Select } from "@weft/components/select"
import { Separator } from "@weft/components/separator"
import { Switch } from "@weft/components/switch"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Schema } from "effect"

export const title = "Preferences dialog"
export const order = 1

const SectionSchema = Schema.Literals(["general", "notifications", "privacy", "shortcuts"])
type Section = typeof SectionSchema.Type

const ToggleSchema = Schema.Literals(["email", "push", "digest", "analytics", "profile", "vim"])
type ToggleKey = typeof ToggleSchema.Type

const Msg = UiSchema.TaggedEnum({
  ChangedOpen: { open: Schema.Boolean },
  Searched: { value: Schema.String },
  Picked: { section: SectionSchema },
  Toggled: { key: ToggleSchema, checked: Schema.Boolean },
  PickedLanguage: { value: Schema.NullOr(Schema.String) },
  PickedStart: { value: Schema.String },
  Saved: {}
})

const sections: ReadonlyArray<readonly [Section, string, ReadonlyArray<string>]> = [
  ["general", "General", ["language", "start page"]],
  ["notifications", "Notifications", ["email", "push", "digest"]],
  ["privacy", "Privacy", ["analytics", "public profile"]],
  ["shortcuts", "Shortcuts", ["vim", "keyboard"]]
]

export default Html.component({
  name: "SettingsDialogPreferences",
  model: Schema.Struct({
    open: Schema.Boolean,
    query: Schema.String,
    section: SectionSchema,
    email: Schema.Boolean,
    push: Schema.Boolean,
    digest: Schema.Boolean,
    analytics: Schema.Boolean,
    profile: Schema.Boolean,
    vim: Schema.Boolean,
    language: Schema.NullOr(Schema.String),
    start: Schema.String,
    saved: Schema.Number
  }),
  message: Msg
}).make({
  init: () => ({
    open: false,
    query: "",
    section: "general" as const,
    email: true,
    push: false,
    digest: true,
    analytics: false,
    profile: true,
    vim: false,
    language: "en",
    start: "inbox",
    saved: 0
  }),
  update: {
    ChangedOpen: ($, { open }) => $.evolve({ open, query: "" }),
    Searched: ($, { value }) => $.evolve({ query: value }),
    Picked: ($, { section }) => $.evolve({ section }),
    Toggled: ($, { key, checked }) => ({ ...$.model, [key]: checked }),
    PickedLanguage: ($, { value }) => $.evolve({ language: value }),
    PickedStart: ($, { value }) => $.evolve({ start: value }),
    Saved: ($) => $.evolve({ open: false, saved: (count) => count + 1 })
  },
  view: (h, model) => {
    const query = model.query.trim().toLowerCase()
    const matches = Array.filter(
      sections,
      ([, label, keywords]) =>
        query === "" || label.toLowerCase().includes(query) || keywords.some((k) => k.includes(query))
    )
    const toggle = (key: ToggleKey, label: string, description: string) =>
      VStack(h.div, { gap: "1" }).children(
        Switch(h, { label, checked: model[key], onToggle: ({ checked }) => Msg.Toggled({ key, checked }) }),
        Text(h.span, { size: "xs", tone: "muted" }).children(description)
      )
    const panel = Match.value(model.section).pipe(
      Match.when("general", () => [
        Select(h, {
          key: "language",
          label: "Language",
          value: model.language,
          items: [
            { value: "en", label: "English" },
            { value: "de", label: "Deutsch" },
            { value: "pt", label: "Português" }
          ],
          onPick: ({ value }) => Msg.PickedLanguage({ value })
        }),
        RadioGroup(h, {
          key: "start",
          label: "Start page",
          value: model.start,
          items: [
            { value: "inbox", label: "Inbox" },
            { value: "projects", label: "Projects" },
            { value: "last", label: "Where I left off" }
          ],
          onPick: ({ value }) => Msg.PickedStart({ value })
        })
      ]),
      Match.when("notifications", () => [
        toggle("email", "Email", "Replies and mentions, as they happen."),
        toggle("push", "Push", "On this device, when the app is closed."),
        toggle("digest", "Weekly digest", "One summary every Monday.")
      ]),
      Match.when("privacy", () => [
        toggle("analytics", "Usage analytics", "Share anonymous usage to help improve Weft."),
        toggle("profile", "Public profile", "Let people outside your workspace see your name.")
      ]),
      Match.orElse(() => [
        toggle("vim", "Vim keys", "Move through lists with j and k."),
        HStack(h.div, { justify: "between", gap: "2" }).children(
          Text(h.span, { size: "sm", weight: "medium" }).children("Command palette"),
          Text(h.kbd, { size: "sm", mono: true, tone: "muted" }).children("⌘ K")
        )
      ])
    )
    return VStack(h.div, { gap: "3", align: "center" }).children(
      Text(h.p, { size: "sm", tone: "muted" }).children(
        Match.value(model.saved).pipe(
          Match.when(0, () => "Open the dialog to change your preferences."),
          Match.when(1, () => "Preferences saved once."),
          Match.orElse((count) => `Preferences saved ${count} times.`)
        )
      ),
      Dialog(h, {
        key: "preferences",
        wide: true,
        open: model.open,
        onOpenChange: ({ open }) => Msg.ChangedOpen({ open }),
        trigger: "Preferences",
        title: "Preferences",
        description: "Changes apply when you save.",
        children: [
          HStack(h.div, { gap: "6", align: "start", wrap: true }).children(
            VStack(h.nav, { gap: "2" })
              .attr("aria-label", "Preference sections")
              .attr("style", "flex:0 0 11rem")
              .children(
                Field(h, {
                  key: "search",
                  label: "Search settings",
                  placeholder: "e.g. digest",
                  value: model.query,
                  onUpdate: ({ value }) => Msg.Searched({ value })
                }),
                ...Match.value(matches.length).pipe(
                  Match.when(0, () => [Text(h.p, { size: "sm", tone: "muted" }).children("No settings match.")]),
                  Match.orElse(() =>
                    matches.map(([section, label]) =>
                      Button(h, {
                        tone: "ghost",
                        size: "sm",
                        fill: true,
                        pressed: model.section === section,
                        onPress: Msg.Picked({ section }),
                        children: label
                      })
                    )
                  )
                )
              ),
            StackItem(VStack(h.section, { gap: "4" }), { grow: true })
              .attr("style", "flex-basis:16rem")
              .children(
                Text(h.h3, { weight: "semibold" }).children(
                  sections.find(([section]) => section === model.section)?.[1] ?? ""
                ),
                Separator(h),
                ...panel
              )
          )
        ],
        footer: [
          Button(h, { onPress: Msg.ChangedOpen({ open: false }), children: "Cancel" }),
          Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })
        ]
      })
    )
  }
})
