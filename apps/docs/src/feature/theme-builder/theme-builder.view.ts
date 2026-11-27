import { Button } from "@weft/components/button"
import { HStack, VStack } from "@weft/components/layout/stack"
import { Swatch } from "@weft/components/swatch"
import { Text } from "@weft/components/text"
import { Select } from "@weft/components/select"
import { ToggleGroup } from "@weft/components/toggle-group"
import { Match, Schema } from "effect"
import { getTheme } from "../../platform/theme/theme.pure.ts"
import { themes } from "../../platform/theme/themes.constant.ts"
import { ModeSchema } from "../../platform/theme/theme.schema.ts"
import { getControls } from "./customize.pure.ts"
import { scales } from "./theme-builder.constant.ts"
import { ThemeBuilderDef } from "./theme-builder.define.ts"
import { type Choices, ThemeBuilderMessageSchema } from "./theme-builder.schema.ts"

export const view = ThemeBuilderDef.view((h) => {
  const { theme, mode, choices } = h.props
  const choose = (patch: Partial<Choices>) =>
    ThemeBuilderMessageSchema.PressedChoice({ choices: { ...choices, ...patch, custom: true } })
  const row = (title: string, content: ReturnType<(typeof h)["div"]["class"]>) =>
    VStack(h.section, { gap: "2" }).children(Text(h.h3, { size: "sm", weight: "semibold" }).children(title), content)
  return VStack(h.div, { gap: "6" }).children(
    HStack(h.div, { justify: "between", align: "center", gap: "2" }).children(
      Text(h.h2, { size: "lg", weight: "semibold" }).children("Theme"),
      Button(h, {
        tone: "ghost",
        size: "sm",
        onPress: ThemeBuilderMessageSchema.PressedClose(),
        label: "Close",
        children: "✕"
      })
    ),
    VStack(h.div, { gap: "2" }).children(
      Select(h, {
        key: "theme",
        label: "Theme",
        value: Match.value(choices.custom).pipe(
          Match.when(true, () => "custom"),
          Match.orElse(() => theme)
        ),
        items: [...themes.map((t) => ({ value: t.name, label: t.name })), { value: "custom", label: "custom" }],
        onPick: ({ value }) =>
          Match.value(value).pipe(
            Match.when(null, () => undefined),
            Match.orElse((picked) => ThemeBuilderMessageSchema.PressedTheme({ theme: picked }))
          )
      }),
      HStack(h.div).children(
        ToggleGroup(h, {
          key: "mode",
          label: "Mode",
          size: "sm",
          items: ModeSchema.literals.map((m) => ({
            value: m,
            label: Match.value(m).pipe(
              Match.when("light", () => "☀ Light"),
              Match.orElse(() => "☾ Dark")
            )
          })),
          value: [mode],
          onToggle: ({ value }) =>
            Match.value(value[0]).pipe(
              Match.when(Schema.is(ModeSchema), (m) => ThemeBuilderMessageSchema.PressedMode({ mode: m })),
              Match.orElse(() => undefined)
            )
        })
      )
    ),
    ...Match.value(choices.custom).pipe(
      Match.when(false, () => []),
      Match.orElse(() => [
        ...getControls({ themes, theme: getTheme({ name: theme }) }).map((control) =>
          row(
            control.title,
            HStack(h.div, { gap: "2", wrap: true }).children(
              Button(h, {
                size: "sm",
                pressed: choices[control.id] === null,
                onPress: choose({ [control.id]: null }),
                children: "Default"
              }),
              ...control.options.map((option) =>
                Button(h, {
                  size: "sm",
                  pressed: choices[control.id] === option.id,
                  onPress: choose({ [control.id]: option.id }),
                  label: option.source,
                  children: [
                    ...Match.value(option.getSwatch).pipe(
                      Match.when(undefined, () => []),
                      Match.orElse((getSwatch) => [Swatch(h.span, { color: getSwatch(mode), size: "sm", round: true })])
                    ),
                    Match.value(control.id === "font" || control.id === "mono").pipe(
                      Match.when(true, () =>
                        h.span.attr("style", `font-family:${option.sample}`).children(option.label)
                      ),
                      Match.orElse(() =>
                        Match.value(control.id === "radius" && option.sample !== undefined).pipe(
                          Match.when(true, () => `${option.label} · ${option.sample}`),
                          Match.orElse(() => option.label)
                        )
                      )
                    )
                  ]
                })
              )
            )
          )
        ),
        row(
          "Scale",
          HStack(h.div).children(
            ToggleGroup(h, {
              key: "scale",
              label: "Scale",
              size: "sm",
              items: scales.map((s) => ({ value: String(s), label: `${s}%` })),
              value: [String(choices.scale)],
              onToggle: ({ value }) =>
                Match.value(scales.find((s) => String(s) === value[0])).pipe(
                  Match.when(undefined, () => undefined),
                  Match.orElse((scale) => choose({ scale }))
                )
            })
          )
        ),
        Button(h, { size: "sm", fill: true, onPress: ThemeBuilderMessageSchema.PressedReset(), children: "Reset" })
      ])
    )
  )
})
