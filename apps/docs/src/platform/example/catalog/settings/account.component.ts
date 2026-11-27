import { Avatar } from "@weft/components/avatar"
import { Button } from "@weft/components/button"
import { Field } from "@weft/components/field"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { RadioGroup } from "@weft/components/radio-group"
import { Select } from "@weft/components/select"
import { Switch } from "@weft/components/switch"
import { Tabs } from "@weft/components/tabs"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "Account settings"
export const order = 1

const NotificationSchema = Schema.Literals(["mentions", "digest", "product"])

const Msg = UiSchema.TaggedEnum({
  PickedTab: { value: Schema.String },
  UpdatedName: { value: Schema.String },
  UpdatedBio: { value: Schema.String },
  PickedLanguage: { value: Schema.NullOr(Schema.String) },
  Toggled: { key: NotificationSchema, checked: Schema.Boolean },
  PickedDensity: { value: Schema.String },
  Saved: {}
})

const notifications = [
  ["mentions", "Mentions", "When someone @mentions you or replies to your thread."],
  ["digest", "Weekly digest", "A Monday summary of what changed in your projects."],
  ["product", "Product updates", "New features and the occasional survey."]
] as const

export default Html.component({
  name: "SettingsAccount",
  model: Schema.Struct({
    tab: Schema.String,
    name: Schema.String,
    bio: Schema.String,
    language: Schema.NullOr(Schema.String),
    mentions: Schema.Boolean,
    digest: Schema.Boolean,
    product: Schema.Boolean,
    density: Schema.String,
    saved: Schema.Boolean
  }),
  message: Msg
}).make({
  init: () => ({
    tab: "profile",
    name: "Ada Lovelace",
    bio: "Writes the first programs.",
    language: "en",
    mentions: true,
    digest: true,
    product: false,
    density: "comfortable",
    saved: false
  }),
  update: {
    PickedTab: ($, { value }) => $.evolve({ tab: value }),
    UpdatedName: ($, { value }) => $.evolve({ name: value, saved: false }),
    UpdatedBio: ($, { value }) => $.evolve({ bio: value, saved: false }),
    PickedLanguage: ($, { value }) => $.evolve({ language: value, saved: false }),
    Toggled: ($, { key, checked }) => ({ ...$.model, [key]: checked, saved: false }),
    PickedDensity: ($, { value }) => $.evolve({ density: value, saved: false }),
    Saved: ($) => $.evolve({ saved: true })
  },
  view: (h, model) =>
    Section(h.div, { surface: "card", pad: "6", gap: "6" })
      .attr("style", "width:100%")
      .children(
        HStack(h.div, { justify: "between", align: "center", gap: "3", wrap: true }).children(
          VStack(h.div, { gap: "1" }).children(
            Text(h.h2, { size: "xl", weight: "semibold" }).children("Settings"),
            Text(h.p, { size: "sm", tone: "muted" }).children("Manage your profile and how Weft talks to you.")
          ),
          HStack(h.div, { gap: "3", align: "center" }).children(
            Text(h.span, { size: "sm", tone: "muted" }).children(
              Match.value(model.saved).pipe(
                Match.when(true, () => "All changes saved"),
                Match.orElse(() => "Unsaved changes")
              )
            ),
            Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" })
          )
        ),
        Tabs(h, {
          key: "settings-tabs",
          label: "Settings sections",
          value: model.tab,
          onSelect: ({ value }) => Msg.PickedTab({ value }),
          tabs: [
            {
              value: "profile",
              label: "Profile",
              content: [
                VStack(h.div, { gap: "4" }).children(
                  HStack(h.div, { gap: "3", align: "center" }).children(
                    Avatar(h, { name: model.name, size: "lg" }),
                    VStack(h.div, { gap: "1" }).children(
                      Text(h.span, { weight: "medium" }).children(model.name),
                      Text(h.span, { size: "sm", tone: "muted" }).children("ada@example.com")
                    )
                  ),
                  Field(h, {
                    key: "name",
                    label: "Display name",
                    value: model.name,
                    onUpdate: ({ value }) => Msg.UpdatedName({ value })
                  }),
                  Field(h, {
                    key: "bio",
                    label: "Bio",
                    description: "Shown on your profile and next to your comments.",
                    value: model.bio,
                    onUpdate: ({ value }) => Msg.UpdatedBio({ value })
                  }),
                  Select(h, {
                    key: "language",
                    label: "Language",
                    value: model.language,
                    items: [
                      { value: "en", label: "English" },
                      { value: "fr", label: "Français" },
                      { value: "ja", label: "日本語" }
                    ],
                    onPick: ({ value }) => Msg.PickedLanguage({ value })
                  })
                )
              ]
            },
            {
              value: "notifications",
              label: "Notifications",
              content: [
                VStack(h.div, { gap: "4" }).children(
                  ...notifications.map(([key, label, description]) =>
                    VStack(h.div, { gap: "1" }).children(
                      Switch(h, {
                        label,
                        checked: model[key],
                        onToggle: ({ checked }) => Msg.Toggled({ key, checked })
                      }),
                      Text(h.span, { size: "sm", tone: "muted" }).children(description)
                    )
                  )
                )
              ]
            },
            {
              value: "appearance",
              label: "Appearance",
              content: [
                RadioGroup(h, {
                  key: "density",
                  label: "Density",
                  value: model.density,
                  items: [
                    { value: "comfortable", label: "Comfortable" },
                    { value: "compact", label: "Compact" }
                  ],
                  onPick: ({ value }) => Msg.PickedDensity({ value })
                })
              ]
            }
          ]
        })
      )
})
