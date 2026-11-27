import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"
import { Button, ButtonSize, ButtonVariant } from "./index.ts"

const Msg = UiSchema.TaggedEnum({ Pressed: {}, ToggledTheme: {} })
const variants = ButtonVariant.literals
const sizes = ButtonSize.literals

export const Gallery = Html.component({
  name: "ShadcnGallery",
  model: Schema.Struct({ theme: Schema.Literals(["light", "dark"]), presses: Schema.Number }),
  message: Msg
}).make({
  init: () => ({ theme: "light", presses: 0 }),
  update: {
    Pressed: ($) => $.evolve({ presses: (n) => n + 1 }),
    ToggledTheme: ($) => $.evolve({ theme: (t) => (t === "light" ? "dark" : "light") })
  },
  view: (h, model) =>
    h.div.attr("data-theme", model.theme).class("gallery").children(
      Button(h, { variant: "outline", size: "sm", onPress: Msg.ToggledTheme(), children: `Theme: ${model.theme}` }),
      ...sizes.map((size) =>
        h.div.class("row").children(
          ...variants.map((variant) =>
            Button(h, { variant, size, onPress: Msg.Pressed(), children: size === "icon" ? "★" : variant })
          ),
          Button(h, { size, disabled: true, children: size === "icon" ? "★" : "disabled" })
        )
      )
    )
})
