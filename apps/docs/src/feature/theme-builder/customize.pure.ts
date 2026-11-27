import { Code, Colors, Font, Hues, Radius, Size, Spacing, Text } from "@acme/components/tokens"
import type { ThemeData } from "@acme/design-system/ThemeSchema"
import { Array, Match, Predicate, Record } from "effect"
import { getThemeVars } from "../../platform/theme/theme.pure.ts"
import type { Mode, Vars } from "../../platform/theme/theme.schema.ts"
import type { GetControlsInput, GetOverridesInput } from "./theme-builder.schema.ts"
export interface ControlOption {
  readonly id: string
  readonly label: string
  readonly source: string
  readonly sample?: string
  readonly getSwatch?: (mode: Mode) => string
  readonly getVars: (mode: Mode) => Vars
}

const getVarName = (ref: string) => ref.slice(4, -1)

const getTokenName = (ref: string) => getVarName(ref).split("-").slice(3).join("-")

const getRefs = (group: object): ReadonlyArray<string> => Array.filter(Record.values(group), Predicate.isString)

const getLightVars = (theme: ThemeData) => getThemeVars({ theme, mode: "light" })

const getGroupVars = (vars: Vars, group: object): Vars =>
  Record.fromEntries(Array.map(getRefs(group), (ref) => [getVarName(ref), vars[getVarName(ref)] ?? ""]))

const getSwatchKey = (option: ControlOption) => option.getSwatch?.("light") ?? option.id

const getFontLabel = (theme: ThemeData, ref: string) =>
  (getLightVars(theme)[getVarName(ref)] ?? "").split(",")[0]!.replaceAll('"', "")

const composeAccentVars = (vars: Vars, accent: string, accentFg: string): Vars => ({
  [getVarName(Colors.accent)]: vars[getVarName(accent)]!,
  [getVarName(Colors.accentFg)]: vars[getVarName(accentFg)]!,
  [getVarName(Colors.ring)]: vars[getVarName(accent)]!
})

export const getControls = ({ themes }: GetControlsInput) => {
  const themeAccents = Array.map(themes, (theme): ControlOption => ({
    id: `${theme.name}:accent`,
    label: theme.name,
    source: `${theme.name} · Colors.accent`,
    getSwatch: (mode) => getThemeVars({ theme, mode })[getVarName(Colors.accent)] ?? "",
    getVars: (mode) => composeAccentVars(getThemeVars({ theme, mode }), Colors.accent, Colors.accentFg)
  }))
  const hueAccents = Array.flatMap(themes, (theme) =>
    Array.map(
      Array.filter(getRefs(Hues), (ref) => ref !== Hues.onHue),
      (ref): ControlOption => {
        const hue = getTokenName(ref)
        return {
          id: `${theme.name}:${hue}`,
          label: hue,
          source: `${theme.name} · Hues.${hue}`,
          getSwatch: (mode) => getThemeVars({ theme, mode })[getVarName(ref)] ?? "",
          getVars: (mode) => composeAccentVars(getThemeVars({ theme, mode }), ref, Hues.onHue)
        }
      }
    )
  )
  const fullRadius = getLightVars(themes[0]!)[getVarName(Radius.full)] ?? "9999px"
  return [
    {
      id: "accent" as const,
      title: "Accent",
      options: Array.dedupeWith([...themeAccents, ...hueAccents], (a, b) => getSwatchKey(a) === getSwatchKey(b))
    },
    {
      id: "neutrals" as const,
      title: "Neutrals",
      options: Array.map(themes, (theme): ControlOption => ({
        id: theme.name,
        label: theme.name,
        source: `${theme.name} · Colors + Code`,
        getSwatch: (mode) => getThemeVars({ theme, mode })[getVarName(Colors.surfaceMuted)] ?? "",
        getVars: (mode) => {
          const vars = getThemeVars({ theme, mode })
          const {
            [getVarName(Colors.accent)]: _accent,
            [getVarName(Colors.accentFg)]: _accentFg,
            [getVarName(Colors.ring)]: _ring,
            [getVarName(Colors.danger)]: _danger,
            [getVarName(Colors.dangerFg)]: _dangerFg,
            ...neutrals
          } = getGroupVars(vars, Colors)
          return { ...neutrals, ...getGroupVars(vars, Code) }
        }
      }))
    },
    {
      id: "radius" as const,
      title: "Radius",
      options: [
        {
          id: "none",
          label: "None",
          source: "0",
          sample: "0px",
          getVars: () =>
            Record.fromEntries(
              Array.map(
                Array.filter(getRefs(Radius), (ref) => ref !== Radius.full),
                (ref) => [getVarName(ref), "0px"]
              )
            )
        },
        ...Array.map(themes, (theme): ControlOption => ({
          id: theme.name,
          label: theme.name,
          source: `${theme.name} · Radius.*`,
          sample: getLightVars(theme)[getVarName(Radius.control)] ?? "",
          getVars: () => getGroupVars(getLightVars(theme), Radius)
        })),
        {
          id: "full",
          label: "Full",
          source: "Radius.full",
          sample: fullRadius,
          getVars: () => ({
            [getVarName(Radius.control)]: fullRadius,
            [getVarName(Radius.avatarSquare)]: fullRadius,
            [getVarName(Radius.container)]: "24px"
          })
        }
      ] satisfies ReadonlyArray<ControlOption>
    },
    {
      id: "sizing" as const,
      title: "Sizing",
      options: Array.map(themes, (theme): ControlOption => ({
        id: theme.name,
        label: theme.name,
        source: `${theme.name} · Spacing + Size + Text`,
        sample: `${getLightVars(theme)[getVarName(Size.controlMd)]} controls`,
        getVars: (mode) => {
          const vars = getThemeVars({ theme, mode })
          return { ...getGroupVars(vars, Spacing), ...getGroupVars(vars, Size), ...getGroupVars(vars, Text) }
        }
      }))
    },
    {
      id: "font" as const,
      title: "Body font",
      options: Array.map(themes, (theme): ControlOption => ({
        id: theme.name,
        label: getFontLabel(theme, Font.body),
        source: `${theme.name} · Font.body`,
        sample: getLightVars(theme)[getVarName(Font.body)] ?? "",
        getVars: () => ({ [getVarName(Font.body)]: getLightVars(theme)[getVarName(Font.body)]! })
      }))
    },
    {
      id: "mono" as const,
      title: "Code font",
      options: Array.map(themes, (theme): ControlOption => ({
        id: theme.name,
        label: getFontLabel(theme, Font.mono),
        source: `${theme.name} · Font.mono`,
        sample: getLightVars(theme)[getVarName(Font.mono)] ?? "",
        getVars: () => ({ [getVarName(Font.mono)]: getLightVars(theme)[getVarName(Font.mono)]! })
      }))
    }
  ]
}

const getScaledLength = (value: string, factor: number) =>
  Match.value(value.match(/^(-?[\d.]+)(px|rem)$/)).pipe(
    Match.when(null, () => value),
    Match.orElse(([, amount, unit]) => `${Math.round(Number(amount) * factor * 1000) / 1000}${unit}`)
  )

export const getOverrides = ({ choices, themes, theme, mode }: GetOverridesInput): Vars => {
  const chosen = Array.reduce(getControls({ themes }), {} as Vars, (vars, control) =>
    Match.value(control.options.find((option: ControlOption) => option.id === choices[control.id])).pipe(
      Match.when(undefined, () => vars),
      Match.orElse((option) => ({ ...vars, ...option.getVars(mode) }))
    )
  )
  if (choices.scale === 100) return chosen
  const current = { ...getThemeVars({ theme, mode }), ...chosen }
  return {
    ...chosen,
    ...Record.fromEntries(
      Array.map([...getRefs(Spacing), ...getRefs(Size), ...getRefs(Text)], (ref) => [
        getVarName(ref),
        getScaledLength(current[getVarName(ref)] ?? "", choices.scale / 100)
      ])
    )
  }
}
