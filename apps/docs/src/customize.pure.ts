import { Code, Colors, Font, Hues, Radius, Size, Spacing, Text } from "@acme/components/tokens"
import { manifest } from "@acme/components/manifest"
import type { Theme } from "@acme/design-system/Theme"
import { cssVarName } from "@acme/design-system/Token"
import { Array, Match, Predicate, Record } from "effect"
import type { Choices, Mode } from "./docs.schema.ts"

type Vars = Readonly<Record<string, string>>

const v = (ref: string) => ref.slice(4, -1)

const label = (group: string, ref: string) => `${group}.${v(ref).split("-").slice(3).join("-")}`
const refs = (group: object): ReadonlyArray<string> => Array.filter(Record.values(group), Predicate.isString)

export const varsOf = (theme: Theme, mode: Mode): Vars => ({
  ...theme.vars.base,
  ...Match.value(mode === "dark").pipe(
    Match.when(true, () => (theme.vars.modes as Record<string, Vars>)["dark"]),
    Match.orElse(() => undefined)
  )
})

export interface Option {
  readonly id: string
  readonly label: string

  readonly source: string
  readonly swatch?: (mode: Mode) => string
  readonly sample?: string
  readonly set: (mode: Mode) => Vars
}

export interface Control {
  readonly id: "accent" | "neutrals" | "radius" | "sizing" | "font" | "mono"
  readonly title: string
  readonly tokens: ReadonlyArray<string>
  readonly options: ReadonlyArray<Option>
}

const radiusOf = (t: Theme) => varsOf(t, "light")
const pick = (vars: Vars, group: object) => Record.fromEntries(Array.map(refs(group), (r) => [v(r), vars[v(r)] ?? ""]))

const swatchKey = (o: Option) => o.swatch?.("light") ?? o.id

export const controls = (themes: ReadonlyArray<Theme>): ReadonlyArray<Control> => {
  const themeAccents = Array.map(themes, (t): Option => ({
    id: `${t.name}:accent`,
    label: `${t.name}`,
    source: `${t.name} · Colors.accent`,
    swatch: (m) => varsOf(t, m)[v(Colors.accent)] ?? "",
    set: (m) => {
      const x = varsOf(t, m)
      return {
        [v(Colors.accent)]: x[v(Colors.accent)]!,
        [v(Colors.accentFg)]: x[v(Colors.accentFg)]!,
        [v(Colors.ring)]: x[v(Colors.ring)]!
      }
    }
  }))
  const hueAccents = Array.flatMap(themes, (t) =>
    Array.map(
      Array.filter(refs(Hues), (r) => r !== Hues.onHue),
      (ref): Option => {
        const name = label("Hues", ref).split(".")[1]!
        return {
          id: `${t.name}:${name}`,
          label: name,
          source: `${t.name} · Hues.${name}`,
          swatch: (m) => varsOf(t, m)[v(ref)] ?? "",
          set: (m) => {
            const x = varsOf(t, m)
            return {
              [v(Colors.accent)]: x[v(ref)]!,
              [v(Colors.accentFg)]: x[v(Hues.onHue)]!,
              [v(Colors.ring)]: x[v(ref)]!
            }
          }
        }
      }
    )
  )
  const accent = Array.dedupeWith([...themeAccents, ...hueAccents], (a, b) => swatchKey(a) === swatchKey(b))
  return [
    {
      id: "accent",
      title: "Accent",
      tokens: [label("Colors", Colors.accent), label("Colors", Colors.accentFg), label("Colors", Colors.ring)],
      options: accent
    },
    {
      id: "neutrals",
      title: "Neutrals",
      tokens: ["Colors.surface…border", "Code.*"],
      options: themes.map((t) => ({
        id: t.name,
        label: t.name,
        source: `${t.name} · Colors + Code`,
        swatch: (m) => varsOf(t, m)[v(Colors.surfaceMuted)] ?? "",
        set: (m) => {
          const x = varsOf(t, m)
          const {
            [v(Colors.accent)]: _a,
            [v(Colors.accentFg)]: _f,
            [v(Colors.ring)]: _r,
            [v(Colors.danger)]: _d,
            [v(Colors.dangerFg)]: _df,
            ...neutral
          } = pick(x, Colors)
          return { ...neutral, ...pick(x, Code) }
        }
      }))
    },
    {
      id: "radius",
      title: "Radius",
      tokens: refs(Radius)
        .filter((r) => r !== Radius.full)
        .map((r) => label("Radius", r)),
      options: [
        {
          id: "none",
          label: "None",
          source: "0",
          sample: "0px",
          set: () =>
            Object.fromEntries(
              refs(Radius)
                .filter((r) => r !== Radius.full)
                .map((r) => [v(r), "0px"])
            )
        },
        ...themes.map((t) => ({
          id: t.name,
          label: t.name,
          source: `${t.name} · Radius.*`,
          sample: radiusOf(t)[v(Radius.control)] ?? "",
          set: () => pick(radiusOf(t), Radius)
        })),
        {
          id: "full",
          label: "Full",
          source: "Radius.full",
          sample: radiusOf(themes[0]!)[v(Radius.full)] ?? "",
          set: () => {
            const full = radiusOf(themes[0]!)[v(Radius.full)] ?? "9999px"
            return { [v(Radius.control)]: full, [v(Radius.avatarSquare)]: full, [v(Radius.container)]: "24px" }
          }
        }
      ]
    },
    {
      id: "sizing",
      title: "Sizing",
      tokens: ["Spacing.*", "Size.*", "Text.*"],
      options: themes.map((t) => ({
        id: t.name,
        label: t.name,
        source: `${t.name} · Spacing + Size + Text`,
        sample: `${varsOf(t, "light")[v(Size.controlMd)]} controls`,
        set: (m) => ({ ...pick(varsOf(t, m), Spacing), ...pick(varsOf(t, m), Size), ...pick(varsOf(t, m), Text) })
      }))
    },
    {
      id: "font",
      title: "Body font",
      tokens: [label("Font", Font.body)],
      options: themes.map((t) => ({
        id: t.name,
        label: (varsOf(t, "light")[v(Font.body)] ?? "").split(",")[0]!.replaceAll('"', ""),
        source: `${t.name} · Font.body`,
        sample: varsOf(t, "light")[v(Font.body)] ?? "",
        set: () => ({ [v(Font.body)]: varsOf(t, "light")[v(Font.body)]! })
      }))
    },
    {
      id: "mono",
      title: "Code font",
      tokens: [label("Font", Font.mono)],
      options: themes.map((t) => ({
        id: t.name,
        label: (varsOf(t, "light")[v(Font.mono)] ?? "").split(",")[0]!.replaceAll('"', ""),
        source: `${t.name} · Font.mono`,
        sample: varsOf(t, "light")[v(Font.mono)] ?? "",
        set: () => ({ [v(Font.mono)]: varsOf(t, "light")[v(Font.mono)]! })
      }))
    }
  ]
}

export const isCustomized = (c: Choices) =>
  Record.some(c, (value, k) =>
    Match.value(k === "scale").pipe(
      Match.when(true, () => value !== 100),
      Match.orElse(() => value !== null)
    )
  )

const scaled = (value: string, factor: number) => {
  const m = value.match(/^(-?[\d.]+)(px|rem)$/)
  return Match.value(m).pipe(
    Match.when(null, () => value),
    Match.orElse(([, n, unit]) => `${Math.round(Number(n) * factor * 1000) / 1000}${unit}`)
  )
}

export const overrides = (choices: Choices, themes: ReadonlyArray<Theme>, theme: Theme, mode: Mode): Vars => {
  const chosen = Array.reduce(controls(themes), {} as Vars, (out, control) => {
    const option = control.options.find((o) => o.id === choices[control.id])
    return Match.value(option).pipe(
      Match.when(undefined, () => out),
      Match.orElse((picked) => ({ ...out, ...picked.set(mode) }))
    )
  })
  if (choices.scale === 100) return chosen
  const current = { ...varsOf(theme, mode), ...chosen }
  return {
    ...chosen,
    ...Record.fromEntries(
      Array.map([...refs(Spacing), ...refs(Size), ...refs(Text)], (ref) => [
        v(ref),
        scaled(current[v(ref)] ?? "", choices.scale / 100)
      ])
    )
  }
}

export const styleOf = (vars: Vars) =>
  Record.toEntries(vars)
    .map(([k, value]) => `${k}:${value}`)
    .join(";")

const encode = (kind: string, css: string): string =>
  Match.value(kind).pipe(
    Match.when("Length", () => {
      const px = css.match(/^(-?[\d.]+)px$/)
      return Match.value(px).pipe(
        Match.when(null, () => JSON.stringify(css)),
        Match.orElse(([, n]) => n!)
      )
    }),
    Match.when("Weight", () => css),
    Match.when("Duration", () =>
      JSON.stringify(
        `${
          Number.parseFloat(css) *
          Match.value(css.endsWith("ms")).pipe(
            Match.when(true, () => 1),
            Match.orElse(() => 1000)
          )
        } millis`
      )
    ),
    Match.when(
      "Font",
      () =>
        `[${css
          .split(/,\s*/)
          .map((f) => JSON.stringify(f.replace(/^"|"$/g, "")))
          .join(", ")}]`
    ),
    Match.orElse(() => JSON.stringify(css))
  )
const key = (k: string) =>
  Match.value(/^[A-Za-z_$][\w$]*$/.test(k)).pipe(
    Match.when(true, () => k),
    Match.orElse(() => JSON.stringify(k))
  )

const groups = (vars: Vars, only?: (name: string, value: string) => boolean, indent = "    ") =>
  Record.toEntries(manifest.tokens)
    .map(([group, t]) => {
      const entries = t.keys
        .map((k) => [k, vars[cssVarName(t.prefix, k)] ?? ""] as const)
        .filter(([k, value]) =>
          Match.value(only).pipe(
            Match.when(undefined, () => true),
            Match.orElse((keep) => keep(cssVarName(t.prefix, k), value))
          )
        )
        .map(([k, value]) => `${key(k)}: ${encode(t.kind, value)}`)
      return Match.value(entries.length > 0).pipe(
        Match.when(true, () => `${indent}${group}: { ${entries.join(", ")} }`),
        Match.orElse(() => "")
      )
    })
    .filter(Boolean)
    .join(",\n")

export const themeSource = (choices: Choices, themes: ReadonlyArray<Theme>, theme: Theme): string => {
  const light = { ...varsOf(theme, "light"), ...overrides(choices, themes, theme, "light") }
  const dark = { ...varsOf(theme, "dark"), ...overrides(choices, themes, theme, "dark") }
  return `// custom.theme.ts: generated by the acme/ui theme builder, starting from ${theme.name}.
import { Tokens } from "@acme/components/tokens"
import * as Theme from "@acme/design-system/Theme"

export const custom = Theme.make(Tokens, {
  name: "custom",
  values: {
${groups(light)}
  },
  modes: {
    dark: {
${groups(dark, (name, value) => light[name] !== value, "      ")}
    }
  }
})
`
}
