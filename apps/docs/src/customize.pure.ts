import { Code, Colors, Font, Hues, Radius, Size, Spacing, Text } from "@acme/components/tokens"
import { manifest } from "@acme/components/manifest"
import type { Theme } from "@acme/design-system/Theme"

export type Mode = "light" | "dark"
type Vars = Readonly<Record<string, string>>

const v = (ref: string) => ref.slice(4, -1)

const label = (group: string, ref: string) => `${group}.${v(ref).split("-").slice(3).join("-")}`
const refs = (group: object) => Object.values(group).filter((x): x is string => typeof x === "string")

export const varsOf = (theme: Theme, mode: Mode): Vars => ({
  ...theme.vars.base,
  ...(mode === "dark" ? (theme.vars.modes as Record<string, Vars>)["dark"] : undefined)
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
const pick = (vars: Vars, group: object) => Object.fromEntries(refs(group).map((r) => [v(r), vars[v(r)] ?? ""]))

export const controls = (themes: ReadonlyArray<Theme>): ReadonlyArray<Control> => {
  const accent: Array<Option> = []
  const seen = new Set<string>()
  const add = (o: Option) => {
    const key = o.swatch?.("light") ?? o.id
    if (!seen.has(key)) {
      seen.add(key)
      accent.push(o)
    }
  }
  for (const t of themes) {
    add({
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
    })
  }
  for (const t of themes) {
    for (const ref of refs(Hues).filter((r) => r !== Hues.onHue)) {
      const name = label("Hues", ref).split(".")[1]!
      add({
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
      })
    }
  }
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

export const scales = [90, 100, 110] as const

export interface Choices {
  readonly accent: string | null
  readonly neutrals: string | null
  readonly radius: string | null
  readonly sizing: string | null
  readonly font: string | null
  readonly mono: string | null
  readonly scale: number
}
export const initialChoices: Choices = {
  accent: null,
  neutrals: null,
  radius: null,
  sizing: null,
  font: null,
  mono: null,
  scale: 100
}
export const isCustomized = (c: Choices) =>
  Object.entries(c).some(([k, value]) => (k === "scale" ? value !== 100 : value !== null))

const scaled = (value: string, factor: number) => {
  const m = value.match(/^(-?[\d.]+)(px|rem)$/)
  return m ? `${Math.round(Number(m[1]) * factor * 1000) / 1000}${m[2]}` : value
}

export const overrides = (
  choices: Choices,
  themes: ReadonlyArray<Theme>,
  theme: Theme,
  mode: Mode
): Record<string, string> => {
  const out: Record<string, string> = {}
  for (const control of controls(themes)) {
    const id = choices[control.id]
    const option = control.options.find((o) => o.id === id)
    if (option) Object.assign(out, option.set(mode))
  }
  if (choices.scale !== 100) {
    const current = { ...varsOf(theme, mode), ...out }
    for (const ref of [...refs(Spacing), ...refs(Size), ...refs(Text)]) {
      out[v(ref)] = scaled(current[v(ref)] ?? "", choices.scale / 100)
    }
  }
  return out
}

export const styleOf = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, value]) => `${k}:${value}`)
    .join(";")

const encode = (kind: string, css: string): string => {
  switch (kind) {
    case "Length": {
      const px = css.match(/^(-?[\d.]+)px$/)
      return px ? px[1]! : JSON.stringify(css)
    }
    case "Weight":
      return css
    case "Duration":
      return JSON.stringify(`${Number.parseFloat(css) * (css.endsWith("ms") ? 1 : 1000)} millis`)
    case "Font":
      return `[${css
        .split(/,\s*/)
        .map((f) => JSON.stringify(f.replace(/^"|"$/g, "")))
        .join(", ")}]`
    default:
      return JSON.stringify(css)
  }
}
const key = (k: string) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k))
const cssVar = (prefix: string, k: string) => `--${prefix}-${k.replaceAll(".", "_")}`

const groups = (vars: Vars, only?: (name: string, value: string) => boolean, indent = "    ") =>
  Object.entries(manifest.tokens)
    .map(([group, t]) => {
      const entries = t.keys
        .map((k) => [k, vars[cssVar(t.prefix, k)] ?? ""] as const)
        .filter(([k, value]) => (only ? only(cssVar(t.prefix, k), value) : true))
        .map(([k, value]) => `${key(k)}: ${encode(t.kind, value)}`)
      return entries.length > 0 ? `${indent}${group}: { ${entries.join(", ")} }` : ""
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
