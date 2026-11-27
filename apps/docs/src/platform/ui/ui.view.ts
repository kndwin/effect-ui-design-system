import { Button } from "@acme/components/button"
import { Section } from "@acme/components/layout/section"
import { HStack } from "@acme/components/layout/stack"
import { Text } from "@acme/components/text"
import type { Html } from "@effect/ui/html"

export const Heading = <Msg>(h: Html.H<Msg>, text: string) =>
  Text(h.h2, { size: "xl", weight: "semibold" }).children(text)

export const InlineCode = <Msg>(h: Html.H<Msg>, text: string) => Text(h.code, { mono: true, size: "xs" }).children(text)

export const Pill = <Msg>(h: Html.H<Msg>, text: string) =>
  Text(Section(h.code, { surface: "muted", pad: "1" }), { mono: true, size: "xs", tone: "muted" }).children(text)

export const Segmented = <Msg>(
  h: Html.H<Msg>,
  label: string,
  items: ReadonlyArray<readonly [key: string, text: string, active: boolean, msg: Msg]>
) =>
  Section(h.div, { surface: "muted", pad: "1" })
    .attr("role", "group")
    .attr("aria-label", label)
    .children(
      HStack(h.div, { gap: "1" }).children(
        ...items.map(([key, text, active, msg]) =>
          Button(h, {
            tone: "ghost",
            size: "sm",
            pressed: active,
            onPress: msg,
            label: `${label}: ${key}`,
            children: text
          })
        )
      )
    )
