import { Colors, Font, Hues, Radius, Size, Spacing, Text } from "@weft/components/tokens"
import type { ThemeData } from "@weft/design-system/ThemeSchema"
import { Array, Match, Order, Predicate, Record } from "effect"
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

const getFontLabel = (theme: ThemeData, ref: string) =>
  (getLightVars(theme)[getVarName(ref)] ?? "").split(",")[0]!.replaceAll('"', "")

const composeAccentVars = (vars: Vars, accent: string, accentFg: string): Vars => ({
  [getVarName(Colors.accent)]: vars[getVarName(accent)]!,
  [getVarName(Colors.accentFg)]: vars[getVarName(accentFg)]!,
  [getVarName(Colors.ring)]: vars[getVarName(accent)]!
})

const sizeNames = ["Small", "Medium", "Large"]
const densityNames = ["Compact", "Regular", "Spacious"]

const getPixels = (value: string) => Number.parseFloat(value) || 0

const getByLength = (themes: ReadonlyArray<ThemeData>, ref: string) =>
  Array.dedupeWith(
    Array.sort(
      themes,
      Order.mapInput(Order.Number, (theme: ThemeData) => getPixels(getLightVars(theme)[getVarName(ref)] ?? ""))
    ),
    (a: ThemeData, b: ThemeData) => getLightVars(a)[getVarName(ref)] === getLightVars(b)[getVarName(ref)]
  )

export const getControls = ({ themes, theme }: GetControlsInput) => {
  const fullRadius = getLightVars(theme)[getVarName(Radius.full)] ?? "9999px"
  return [
    {
      id: "accent" as const,
      title: "Accent",
      options: Array.map(
        Array.filter(getRefs(Hues), (ref) => ref !== Hues.onHue),
        (ref): ControlOption => {
          const hue = getTokenName(ref)
          return {
            id: hue,
            label: hue,
            source: `Hues.${hue}`,
            getSwatch: (mode) => getThemeVars({ theme, mode })[getVarName(ref)] ?? "",
            getVars: (mode) => composeAccentVars(getThemeVars({ theme, mode }), ref, Hues.onHue)
          }
        }
      )
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
        ...Array.map(getByLength(themes, Radius.control), (source, index): ControlOption => ({
          id: `radius-${getLightVars(source)[getVarName(Radius.control)]}`,
          label: sizeNames[index] ?? `Size ${index + 1}`,
          source: "Radius.*",
          sample: getLightVars(source)[getVarName(Radius.control)] ?? "",
          getVars: () => getGroupVars(getLightVars(source), Radius)
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
      title: "Density",
      options: Array.map(getByLength(themes, Size.controlMd), (source, index): ControlOption => ({
        id: `sizing-${getLightVars(source)[getVarName(Size.controlMd)]}`,
        label: densityNames[index] ?? `Density ${index + 1}`,
        source: "Spacing + Size + Text",
        sample: `${getLightVars(source)[getVarName(Size.controlMd)]} controls`,
        getVars: (mode) => {
          const vars = getThemeVars({ theme: source, mode })
          return { ...getGroupVars(vars, Spacing), ...getGroupVars(vars, Size), ...getGroupVars(vars, Text) }
        }
      }))
    },
    {
      id: "font" as const,
      title: "Body font",
      options: Array.map(themes, (source): ControlOption => ({
        id: `font-${getFontLabel(source, Font.body)}`,
        label: getFontLabel(source, Font.body),
        source: "Font.body",
        sample: getLightVars(source)[getVarName(Font.body)] ?? "",
        getVars: () => ({ [getVarName(Font.body)]: getLightVars(source)[getVarName(Font.body)]! })
      }))
    },
    {
      id: "mono" as const,
      title: "Code font",
      options: Array.map(themes, (source): ControlOption => ({
        id: `mono-${getFontLabel(source, Font.mono)}`,
        label: getFontLabel(source, Font.mono),
        source: "Font.mono",
        sample: getLightVars(source)[getVarName(Font.mono)] ?? "",
        getVars: () => ({ [getVarName(Font.mono)]: getLightVars(source)[getVarName(Font.mono)]! })
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
  if (!choices.custom) return {}
  const chosen = Array.reduce(getControls({ themes, theme }), {} as Vars, (vars, control) =>
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
