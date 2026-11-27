import { Avatar } from "@acme/components/avatar"
import { Button } from "@acme/components/button"
import { UiSchema } from "@effect/ui"
import { Text } from "@acme/components/text"
import { HStack, VStack } from "@acme/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "One component tree, any theme"

const Msg = UiSchema.TaggedEnum({ ToggledFollow: {} })

export default Html.component({ name: "ProfileCard", model: Schema.Boolean, message: Msg }).make({
  init: () => false,
  update: { ToggledFollow: ($) => !$.model },
  view: (h, following) =>
    HStack(h.div, { gap: "4", wrap: true, justify: "center" }).children(
      Avatar(h, { name: "Ada Lovelace", size: "lg", key: "ada" }),
      VStack(h.div).children(
        Text(h.strong, { weight: "semibold" }).children("Ada Lovelace"),
        Text(h.span, { size: "sm", tone: "muted" }).children("Analytical Engine · London")
      ),
      HStack(h.div, { gap: "3", wrap: true, justify: "center" }).children(
        Button(h, {
          tone: following ? "neutral" : "primary",
          size: "sm",
          onPress: Msg.ToggledFollow(),
          children: following ? "Following" : "Follow"
        }),
        Button(h, { tone: "danger", size: "sm", children: "Block" })
      )
    )
})
