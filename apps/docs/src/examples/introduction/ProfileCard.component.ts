import { Avatar, Button } from "@acme/components"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "One component tree, any theme"

const Msg = UiSchema.TaggedEnum({ ToggledFollow: {} })

export default Html.component({ name: "ProfileCard", model: Schema.Boolean, message: Msg }).make({
  init: () => false,
  update: { ToggledFollow: ($) => !$.model },
  view: (h, following) =>
    h.div.class("example-profile").children(
      Avatar(h, { name: "Ada Lovelace", size: "lg", key: "ada" }),
      h.div
        .class("example-profile-text")
        .children(h.strong.children("Ada Lovelace"), h.span.children("Analytical Engine · London")),
      h.div.class("example-row").children(
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
