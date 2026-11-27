import { Avatar } from "@weft/components/avatar"
import { Button } from "@weft/components/button"
import { UiSchema } from "@effect/ui"
import { Text } from "@weft/components/text"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Html } from "@effect/ui/html"
import { Match, Schema } from "effect"

export const title = "One component tree, any theme"
export const order = 1

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
          tone: Match.value(following).pipe(
            Match.when(true, () => "neutral" as const),
            Match.orElse(() => "primary" as const)
          ),
          size: "sm",
          onPress: Msg.ToggledFollow(),
          children: Match.value(following).pipe(
            Match.when(true, () => "Following"),
            Match.orElse(() => "Follow")
          )
        }),
        Button(h, { tone: "danger", size: "sm", children: "Block" })
      )
    )
})
