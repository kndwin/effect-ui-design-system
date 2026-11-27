import { Button } from "@weft/components/button"
import { Field } from "@weft/components/field"
import { Fieldset } from "@weft/components/fieldset"
import { Form } from "@weft/components/form"
import { Grid } from "@weft/components/layout/grid"
import { HStack, StackItem, VStack } from "@weft/components/layout/stack"
import { Section } from "@weft/components/layout/section"
import { NumberField } from "@weft/components/number-field"
import { RadioGroup } from "@weft/components/radio-group"
import { Select } from "@weft/components/select"
import { Separator } from "@weft/components/separator"
import { Text } from "@weft/components/text"
import { UiSchema } from "@effect/ui"
import { Html } from "@effect/ui/html"
import { Array, Match, Number, Option, Schema } from "effect"

export const title = "Checkout with order summary"
export const order = 1

const FieldNameSchema = Schema.Literals(["email", "name", "address", "card", "expiry", "cvc"])
type FieldName = typeof FieldNameSchema.Type

const Msg = UiSchema.TaggedEnum({
  Updated: { field: FieldNameSchema, value: Schema.String },
  PickedCountry: { value: Schema.NullOr(Schema.String) },
  PickedShipping: { value: Schema.String },
  ChangedQuantity: { index: Schema.Number, value: Schema.NullOr(Schema.Number) },
  Paid: {}
})

const products = [
  { name: "Weft tote bag", price: 24 },
  { name: "Token contract poster", price: 18 }
]

const shipping = [
  { value: "standard", label: "Standard, 5 to 7 days, free", price: 0 },
  { value: "express", label: "Express, 1 to 2 days, $12", price: 12 }
]

const formatPrice = (amount: number) => `$${amount.toFixed(2)}`

export default Html.component({
  name: "CheckoutOrder",
  model: Schema.Struct({
    email: Schema.String,
    name: Schema.String,
    address: Schema.String,
    card: Schema.String,
    expiry: Schema.String,
    cvc: Schema.String,
    country: Schema.NullOr(Schema.String),
    shipping: Schema.String,
    quantities: Schema.Array(Schema.Number),
    paid: Schema.Boolean
  }),
  message: Msg
}).make({
  init: () => ({
    email: "",
    name: "",
    address: "",
    card: "",
    expiry: "",
    cvc: "",
    country: "gb",
    shipping: "standard",
    quantities: [1, 2],
    paid: false
  }),
  update: {
    Updated: ($, { field, value }) => ({ ...$.model, [field]: value }),
    PickedCountry: ($, { value }) => $.evolve({ country: value }),
    PickedShipping: ($, { value }) => $.evolve({ shipping: value }),
    ChangedQuantity: ($, { index, value }) =>
      $.evolve({
        quantities: Array.replace($.model.quantities, index, value ?? 0).pipe(
          Option.getOrElse(() => $.model.quantities)
        )
      }),
    Paid: ($) => $.evolve({ paid: true })
  },
  view: (h, model) => {
    const field = (name: FieldName, label: string, type?: string, placeholder?: string) =>
      Field(h, {
        key: name,
        label,
        value: model[name],
        type,
        placeholder,
        onUpdate: ({ value }) => Msg.Updated({ field: name, value })
      })
    const subtotal = Number.sumAll(products.map((product, index) => product.price * (model.quantities[index] ?? 0)))
    const delivery = shipping.find((option) => option.value === model.shipping)?.price ?? 0
    const total = subtotal + delivery
    const line = (label: string, amount: string, strong: boolean) =>
      HStack(h.div, { justify: "between", gap: "2" }).children(
        Text(h.span, {
          size: "sm",
          tone: Match.value(strong).pipe(
            Match.when(true, () => "default" as const),
            Match.orElse(() => "muted" as const)
          ),
          weight: Match.value(strong).pipe(
            Match.when(true, () => "semibold" as const),
            Match.orElse(() => "regular" as const)
          )
        }).children(label),
        Text(h.span, { size: "sm" }).children(amount)
      )
    return HStack(h.div, { gap: "6", align: "start", wrap: true })
      .attr("style", "width:100%")
      .children(
        h.div.children(
          Form(h, {
            label: "Checkout",
            onSubmit: () => Msg.Paid(),
            children: [
              Fieldset(h, { key: "contact", legend: "Contact", children: [field("email", "Email", "email")] }),
              Fieldset(h, {
                key: "shipping",
                legend: "Shipping",
                children: [
                  field("name", "Full name"),
                  field("address", "Address"),
                  Select(h, {
                    key: "country",
                    label: "Country",
                    value: model.country,
                    items: [
                      { value: "gb", label: "United Kingdom" },
                      { value: "us", label: "United States" },
                      { value: "au", label: "Australia" }
                    ],
                    onPick: ({ value }) => Msg.PickedCountry({ value })
                  }),
                  RadioGroup(h, {
                    key: "method",
                    label: "Delivery",
                    value: model.shipping,
                    items: shipping,
                    onPick: ({ value }) => Msg.PickedShipping({ value })
                  })
                ]
              }),
              Fieldset(h, {
                key: "payment",
                legend: "Payment",
                children: [
                  field("card", "Card number", "text", "4242 4242 4242 4242"),
                  Grid(h.div, { columns: "2", gap: "3" }).children(
                    field("expiry", "Expiry", "text", "MM / YY"),
                    field("cvc", "CVC")
                  )
                ]
              }),
              Button(h, {
                type: "submit",
                tone: "primary",
                children: Match.value(model.paid).pipe(
                  Match.when(true, () => "Order placed"),
                  Match.orElse(() => `Pay ${formatPrice(total)}`)
                )
              })
            ]
          })
        ),
        StackItem(Section(h.aside, { surface: "muted", pad: "4", gap: "4" }), { grow: true }).children(
          Text(h.h3, { weight: "semibold" }).children("Order summary"),
          ...products.map((product, index) =>
            VStack(h.div, { gap: "2" }).children(
              line(product.name, formatPrice(product.price * (model.quantities[index] ?? 0)), false),
              NumberField(h, {
                key: `quantity-${index}`,
                label: "Quantity",
                value: model.quantities[index] ?? 0,
                min: 0,
                max: 9,
                onUpdate: ({ value }) => Msg.ChangedQuantity({ index, value })
              })
            )
          ),
          Separator(h),
          line("Subtotal", formatPrice(subtotal), false),
          line(
            "Delivery",
            Match.value(delivery).pipe(
              Match.when(0, () => "Free"),
              Match.orElse(formatPrice)
            ),
            false
          ),
          line("Total", formatPrice(total), true)
        )
      )
  }
})
