// The theme customizer. Every control is declared against the exported token refs
// (Colors.accent, Radius.control, …), so what it can change is exactly the contract.
// It produces (1) CSS variable overrides for the live preview and (2) a Theme.make file.
import { Code, Colors, DS, Font, Radius, Size, Spacing, Text } from "@acme/components"
import type { Theme } from "@acme/ds/Theme"

/** `var(--color-accent)` → `--color-accent` */
const v = (ref: string) => ref.slice(4, -1)
const label = (group: string, ref: string) => `${group}.${v(ref).split("-").slice(3).join("-")}`

export type Mode = "light" | "dark"

// ─── choices ──────────────────────────────────────────────────────────────

/** Radix-style step-9 accents. Light accents get dark text. */
export const accents = [
  ["gray", "#8d8d8d"],
  ["gold", "#978365"],
  ["bronze", "#a18072"],
  ["brown", "#ad7f58"],
  ["yellow", "#ffe629", true],
  ["amber", "#ffc53d", true],
  ["orange", "#f76b15"],
  ["tomato", "#e54d2e"],
  ["red", "#e5484d"],
  ["ruby", "#e54666"],
  ["crimson", "#e93d82"],
  ["pink", "#d6409f"],
  ["plum", "#ab4aba"],
  ["purple", "#8e4ec6"],
  ["violet", "#6e56cf"],
  ["iris", "#5b5bd6"],
  ["indigo", "#3e63dd"],
  ["blue", "#0090ff"],
  ["cyan", "#00a2c7"],
  ["teal", "#12a594"],
  ["jade", "#29a383"],
  ["green", "#30a46c"],
  ["grass", "#46a758"],
  ["lime", "#bdee63", true],
  ["mint", "#86ead4", true],
  ["sky", "#7ce2fe", true]
] as const satisfies ReadonlyArray<readonly [string, string, boolean?]>

/** Neutral families: [swatch, light: muted surface / border / muted text, dark: same] */
export const grays = {
  gray: ["#8d8d8d", ["#f0f0f0", "#d9d9d9", "#646464"], ["#222222", "#3a3a3a", "#b4b4b4"]],
  mauve: ["#8e8c99", ["#f2eff3", "#dbd8e0", "#65636d"], ["#232225", "#3c393f", "#b5b2bc"]],
  slate: ["#8b8d98", ["#f0f0f3", "#d9d9e0", "#60646c"], ["#212225", "#363a3f", "#b0b4ba"]],
  sage: ["#868e8b", ["#eff1f0", "#d7dad9", "#5f6563"], ["#202221", "#373b39", "#adb5b2"]],
  olive: ["#898e87", ["#eff1ef", "#d7dad7", "#60655f"], ["#212220", "#383a36", "#afb5ad"]],
  sand: ["#8d8d86", ["#f1f0ef", "#dad9d6", "#63635e"], ["#222221", "#3b3a37", "#b5b3ad"]]
} as const

export const radii = {
  none: { control: 0, container: 0, avatarSquare: 0 },
  small: { control: 4, container: 8, avatarSquare: 4 },
  medium: { control: 8, container: 12, avatarSquare: 8 },
  large: { control: 12, container: 16, avatarSquare: 12 },
  full: { control: 9999, container: 24, avatarSquare: 9999 }
} as const

export const scalings = [90, 95, 100, 105, 110] as const

export const fonts = {
  Geist: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
  Inter: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
  Figtree: ["Figtree", "system-ui", "sans-serif"],
  System: ["system-ui", "sans-serif"]
} as const

// ─── which tokens each control sets ───────────────────────────────────────

export const sets = {
  accent: [label("Colors", Colors.accent), label("Colors", Colors.ring), label("Colors", Colors.accentFg)],
  gray: [
    label("Colors", Colors.surfaceMuted),
    label("Colors", Colors.border),
    label("Colors", Colors.fgMuted),
    label("Code", Code.surface),
    label("Code", Code.border)
  ],
  radius: [label("Radius", Radius.control), label("Radius", Radius.container), label("Radius", Radius.avatarSquare)],
  scaling: ["Spacing.*", "Size.*", "Text.*"],
  font: [label("Font", Font.body)]
}

export interface Choices {
  readonly accent: string | null
  readonly gray: string | null
  readonly radius: string | null
  readonly scaling: number
  readonly font: string | null
}
export const initialChoices: Choices = { accent: null, gray: null, radius: null, scaling: 100, font: null }

const quoteStack = (stack: ReadonlyArray<string>) =>
  stack.map((f) => (/^[a-z-]+$/.test(f) ? f : JSON.stringify(f))).join(", ")

const scale = (value: string, factor: number) => {
  const m = value.match(/^(-?[\d.]+)(px|rem)$/)
  return m ? `${Math.round(Number(m[1]) * factor * 1000) / 1000}${m[2]}` : value
}

/** CSS variable overrides for one mode, layered over `theme`. */
export const overrides = (choices: Choices, theme: Theme, mode: Mode): Record<string, string> => {
  const out: Record<string, string> = {}
  const accent = accents.find(([name]) => name === choices.accent)
  if (accent) {
    out[v(Colors.accent)] = accent[1]
    out[v(Colors.ring)] = accent[1]
    out[v(Colors.accentFg)] = accent[2] === true ? "#1a1a1a" : "#ffffff"
  }
  const gray = choices.gray ? grays[choices.gray as keyof typeof grays] : undefined
  if (gray) {
    const [muted, border, fgMuted] = gray[mode === "dark" ? 2 : 1]
    out[v(Colors.surfaceMuted)] = muted
    out[v(Colors.border)] = border
    out[v(Colors.fgMuted)] = fgMuted
    out[v(Code.surface)] = muted
    out[v(Code.border)] = border
  }
  const radius = choices.radius ? radii[choices.radius as keyof typeof radii] : undefined
  if (radius) {
    out[v(Radius.control)] = `${radius.control}px`
    out[v(Radius.container)] = `${radius.container}px`
    out[v(Radius.avatarSquare)] = `${radius.avatarSquare}px`
  }
  if (choices.scaling !== 100) {
    for (const group of [Spacing, Size, Text]) {
      for (const ref of Object.values(group).filter((x): x is string => typeof x === "string")) {
        const base = theme.vars.base[v(ref)]
        if (base) out[v(ref)] = scale(base, choices.scaling / 100)
      }
    }
  }
  const font = choices.font ? fonts[choices.font as keyof typeof fonts] : undefined
  if (font) out[v(Font.body)] = quoteStack(font)
  return out
}

export const styleOf = (vars: Record<string, string>) =>
  Object.entries(vars)
    .map(([k, value]) => `${k}:${value}`)
    .join(";")

export const isCustomized = (c: Choices) =>
  c.accent !== null || c.gray !== null || c.radius !== null || c.scaling !== 100 || c.font !== null

// ─── Copy theme: a Theme.make file ────────────────────────────────────────

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

const groups = (
  vars: Record<string, string>,
  only?: (group: string, k: string, value: string) => boolean,
  indent = "    "
) =>
  Object.entries(DS.manifest.tokens)
    .map(([group, t]) => {
      const entries = t.keys
        .map((k) => [k, vars[`--${t.prefix}-${k.replaceAll(".", "_")}`] ?? ""] as const)
        .filter(([k, value]) => (only ? only(group, k, value) : true))
        .map(([k, value]) => `${key(k)}: ${encode(t.kind, value)}`)
      return entries.length ? `${indent}${group}: { ${entries.join(", ")} }` : ""
    })
    .filter(Boolean)
    .join(",\n")

export const themeSource = (choices: Choices, theme: Theme): string => {
  const light = { ...theme.vars.base, ...overrides(choices, theme, "light") }
  const darkBase = { ...theme.vars.base, ...(theme.vars.modes as Record<string, Record<string, string>>)["dark"] }
  const dark = { ...darkBase, ...overrides(choices, theme, "dark") }
  const darkOnly = (group: string, k: string, value: string) => {
    const t = DS.manifest.tokens[group as keyof typeof DS.manifest.tokens]!
    return light[`--${t.prefix}-${k.replaceAll(".", "_")}`] !== value
  }
  return `import { Tokens } from "@acme/components/tokens"
import { Theme } from "@acme/ds"

// Generated by the acme/ui customizer${isCustomized(choices) ? `, starting from ${theme.name}` : ` (${theme.name})`}.
export const custom = Theme.make(Tokens, {
  name: "custom",
  values: {
${groups(light)}
  },
  modes: {
    dark: {
${groups(dark, darkOnly, "      ")}
    }
  }
})
`
}
