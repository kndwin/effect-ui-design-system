import { NavigationMenu } from "@weft/components/navigation-menu"
import { Html } from "@effect/ui/html"
import { Schema } from "effect"

export const title = "Site navigation"
export const order = 1

export default Html.component({ name: "NavigationMenuSite", model: Schema.Null, message: Schema.Never }).make({
  init: () => null,
  update: ($) => $.model,
  view: (h) =>
    NavigationMenu(h, {
      label: "Docs sections",
      links: [
        { href: "/", label: "Introduction" },
        { href: "/components/navigation-menu", label: "Components", active: true },
        { href: "/tokens", label: "Tokens" }
      ]
    })
})
