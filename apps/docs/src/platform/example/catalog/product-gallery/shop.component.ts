import { Button } from "@weft/components/button"
import { Field } from "@weft/components/field"
import { Grid } from "@weft/components/layout/grid"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { Select } from "@weft/components/select"
import { Text } from "@weft/components/text"
import { ToggleGroup } from "@weft/components/toggle-group"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Number, Order, Schema } from "effect"

export const title = "Product grid"
export const order = 1

const products = [
  { id: "tote", name: "Weft tote bag", category: "accessories", price: 24, hue: "blue", featured: 1 },
  { id: "poster", name: "Token contract poster", category: "prints", price: 18, hue: "amber", featured: 2 },
  { id: "tee", name: "Warp and weft tee", category: "apparel", price: 32, hue: "green", featured: 3 },
  { id: "mug", name: "Theme switcher mug", category: "accessories", price: 14, hue: "rose", featured: 4 },
  { id: "hoodie", name: "Dark mode hoodie", category: "apparel", price: 58, hue: "blue", featured: 5 },
  { id: "print", name: "Woven grid print", category: "prints", price: 40, hue: "green", featured: 6 }
] as const

type Product = (typeof products)[number]

const categories = [
  { value: "all", label: "All" },
  { value: "apparel", label: "Apparel" },
  { value: "prints", label: "Prints" },
  { value: "accessories", label: "Accessories" }
]

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
  { value: "name", label: "Name" }
]

const getOrder = (sort: string): Order.Order<Product> =>
  Match.value(sort).pipe(
    Match.when("low", () => Order.mapInput(Order.Number, (p: Product) => p.price)),
    Match.when("high", () => Order.flip(Order.mapInput(Order.Number, (p: Product) => p.price))),
    Match.when("name", () => Order.mapInput(Order.String, (p: Product) => p.name)),
    Match.orElse(() => Order.mapInput(Order.Number, (p: Product) => p.featured))
  )

const Msg = UiSchema.TaggedEnum({
  Searched: { value: Schema.String },
  Filtered: { value: Schema.Array(Schema.String) },
  Sorted: { value: Schema.NullOr(Schema.String) },
  Added: { id: Schema.String },
  Cleared: {}
})

export default Html.component({
  name: "ProductGalleryShop",
  model: Schema.Struct({
    query: Schema.String,
    category: Schema.String,
    sort: Schema.String,
    cart: Schema.Array(Schema.String)
  }),
  message: Msg
}).make({
  init: () => ({ query: "", category: "all", sort: "featured", cart: [] }),
  update: {
    Searched: ($, { value }) => $.evolve({ query: value }),
    Filtered: ($, { value }) => $.evolve({ category: value[0] ?? "all" }),
    Sorted: ($, { value }) => $.evolve({ sort: value ?? "featured" }),
    Added: ($, { id }) => $.evolve({ cart: (cart) => [...cart, id] }),
    Cleared: ($) => $.evolve({ query: "", category: "all" })
  },
  view: (h, model) => {
    const query = model.query.trim().toLowerCase()
    const shown = Array.sort(
      Array.filter(
        products,
        (p) => (model.category === "all" || p.category === model.category) && p.name.toLowerCase().includes(query)
      ),
      getOrder(model.sort)
    )
    const total = Number.sumAll(model.cart.map((id) => products.find((p) => p.id === id)?.price ?? 0))
    return VStack(h.div, { gap: "4" })
      .attr("style", "width:100%")
      .children(
        HStack(h.div, { justify: "between", align: "center", gap: "3", wrap: true }).children(
          VStack(h.div, { gap: "1" }).children(
            Text(h.h2, { size: "xl", weight: "semibold" }).children("Shop"),
            Text(h.p, { size: "sm", tone: "muted" }).children(`${shown.length} of ${products.length} products`)
          ),
          Text(h.span, { size: "sm", weight: "medium" })
            .attr("aria-live", "polite")
            .children(`Cart: ${model.cart.length} · $${total}`)
        ),
        HStack(h.div, { gap: "3", align: "end", wrap: true }).children(
          StackItem(h.div, { grow: true }).children(
            Field(h, {
              key: "search",
              label: "Search",
              placeholder: "Product name",
              value: model.query,
              onUpdate: ({ value }) => Msg.Searched({ value })
            })
          ),
          Select(h, {
            key: "sort",
            label: "Sort by",
            value: model.sort,
            items: sorts,
            onPick: ({ value }) => Msg.Sorted({ value })
          })
        ),
        HStack(h.div).children(
          ToggleGroup(h, {
            key: "category",
            label: "Category",
            size: "sm",
            items: categories,
            value: [model.category],
            onToggle: ({ value }) => Msg.Filtered({ value })
          })
        ),
        Match.value(shown.length).pipe(
          Match.when(0, () =>
            Section(h.div, { surface: "muted", pad: "6", gap: "3" }).children(
              Text(h.p, { weight: "medium" }).children("No products match."),
              HStack(h.div).children(Button(h, { size: "sm", onPress: Msg.Cleared(), children: "Clear filters" }))
            )
          ),
          Match.orElse(() =>
            Grid(h.ul, { columns: "3", gap: "4", stack: true })
              .attr("style", "margin:0;padding:0;list-style:none")
              .children(
                ...shown.map((p) => {
                  const inCart = model.cart.filter((id) => id === p.id).length
                  return Section(h.li, { surface: "card", pad: "3", gap: "3" })
                    .key(p.id)
                    .children(
                      h.div
                        .attr("role", "img")
                        .attr("aria-label", p.name)
                        .attr(
                          "style",
                          `aspect-ratio:4/3;border-radius:var(--radius-control);background:linear-gradient(135deg,var(--hue-${p.hue}),var(--color-surfaceMuted))`
                        ),
                      VStack(h.div, { gap: "1" }).children(
                        Text(h.span, { weight: "medium" }).children(p.name),
                        Text(h.span, { size: "xs", tone: "muted" }).children(
                          categories.find((c) => c.value === p.category)?.label ?? p.category
                        )
                      ),
                      HStack(h.div, { justify: "between", align: "center", gap: "2" }).children(
                        Text(h.span, { weight: "semibold" }).children(`$${p.price}`),
                        Button(h, {
                          size: "sm",
                          tone: Match.value(inCart > 0).pipe(
                            Match.when(true, () => "primary" as const),
                            Match.orElse(() => "neutral" as const)
                          ),
                          onPress: Msg.Added({ id: p.id }),
                          label: `Add ${p.name} to cart`,
                          children: Match.value(inCart).pipe(
                            Match.when(0, () => "Add"),
                            Match.orElse((count) => `Added · ${count}`)
                          )
                        })
                      )
                    )
                })
              )
          )
        )
      )
  }
})
