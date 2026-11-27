import { Button } from "@acme/components/button"
import { HStack, VStack } from "@acme/components/layout/stack"
import { Swatch } from "@acme/components/swatch"
import { Text } from "@acme/components/text"
import { Match } from "effect"
import { themes } from "../../platform/theme/themes.constant.ts"
import { ModeSchema } from "../../platform/theme/theme.schema.ts"
import { Segmented } from "../../platform/ui/ui.view.ts"
import { getControls } from "./customize.pure.ts"
import { scales } from "./theme-builder.constant.ts"
import { ThemeBuilderDef } from "./theme-builder.define.ts"
import { type Choices, ThemeBuilderMessageSchema } from "./theme-builder.schema.ts"

export const view = ThemeBuilderDef.view((h) => {
  const { theme, mode, choices } = h.props
  const choose = (patch: Partial<Choices>) =>
    ThemeBuilderMessageSchema.PressedChoice({ choices: { ...choices, ...patch } })
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
    row(
      "Base",
      VStack(h.div, { gap: "2" }).children(
        Segmented(
          h,
          "Theme",
          themes.map(
            (t) =>
              [t.name, t.name, theme === t.name, ThemeBuilderMessageSchema.PressedTheme({ theme: t.name })] as const
          )
        ),
        Segmented(
          h,
          "Mode",
          ModeSchema.literals.map(
            (m) =>
              [
                m,
                Match.value(m).pipe(
                  Match.when("light", () => "☀ Light"),
                  Match.orElse(() => "☾ Dark")
                ),
                mode === m,
                ThemeBuilderMessageSchema.PressedMode({ mode: m })
              ] as const
          )
        )
      )
    ),
    ...getControls({ themes }).map((control) =>
      row(
        control.title,
        HStack(h.div, { gap: "2", wrap: true }).children(
          Button(h, {
            size: "sm",
            pressed: choices[control.id] === null,
            onPress: choose({ [control.id]: null }),
            children: "Base"
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
                  Match.when(true, () => h.span.attr("style", `font-family:${option.sample}`).children(option.label)),
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
      Segmented(
        h,
        "Scale",
        scales.map((s) => [String(s), `${s}%`, choices.scale === s, choose({ scale: s })] as const)
      )
    ),
    Button(h, { size: "sm", fill: true, onPress: ThemeBuilderMessageSchema.PressedReset(), children: "Reset" })
  )
})
