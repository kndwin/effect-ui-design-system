import { Array, Match, Option, Record, Schema } from "effect"
import { GroupTypeId } from "../../platform/token/token.constant.ts"
import type { AnyGroup } from "../../platform/token/token.pure.ts"
import { mapTokenKeyToCssVarName } from "../../platform/token/token.pure.map.ts"
import type { MapVarsToThemeSourceInput } from "./theme.schema.ts"

type Vars = Readonly<Record<string, string>>

const getKeySource = (key: string) =>
  Match.value(/^([A-Za-z_$][\w$]*|\d+)$/.test(key)).pipe(
    Match.when(true, () => key),
    Match.orElse(() => JSON.stringify(key))
  )

const getVarNames = (group: AnyGroup) =>
  Array.map(
    group[GroupTypeId].keys,
    (key) => [String(key), mapTokenKeyToCssVarName({ prefix: group[GroupTypeId].prefix, key })] as const
  )

const isList = (value: unknown): value is ReadonlyArray<unknown> => Array.isArray(value)

const getJsonSource = (value: unknown): string =>
  Match.value(value).pipe(
    Match.when(isList, (items) => `[${items.map(getJsonSource).join(", ")}]`),
    Match.orElse(() => JSON.stringify(value))
  )

const getValueSource = (group: AnyGroup, css: string) =>
  getJsonSource(Option.getOrElse(Schema.encodeUnknownOption(group[GroupTypeId].value)(css), (): unknown => css))

const getGroupSource = (name: string, group: AnyGroup, vars: Vars, indent: string) =>
  [
    `${indent}Layer.succeed(Tokens.${name}, {`,
    Array.map(
      getVarNames(group),
      ([key, varName]) => `${indent}  ${getKeySource(key)}: ${getValueSource(group, vars[varName] ?? "")}`
    ).join(",\n"),
    `${indent}})`
  ].join("\n")

const getLayerSource = (groups: ReadonlyArray<readonly [string, AnyGroup]>, vars: Vars, indent: string) =>
  [
    "Layer.mergeAll(",
    Array.map(groups, ([name, group]) => getGroupSource(name, group, vars, `${indent}  `)).join(",\n"),
    `${indent})`
  ].join("\n")

const isChanged = (group: AnyGroup, base: Vars, vars: Vars) =>
  Array.some(getVarNames(group), ([, varName]) => base[varName] !== vars[varName])

const getIdentifier = (name: string) => name.replaceAll(/-([a-z0-9])/g, (_match, c: string) => c.toUpperCase())

export const mapVarsToThemeSource = ({
  tokens,
  name,
  isDefault,
  vars,
  modes,
  tokensImport
}: MapVarsToThemeSourceInput): string => {
  const groups = Record.toEntries(tokens as Readonly<Record<string, AnyGroup>>)
  const modeSources = Array.getSomes(
    Array.map(Record.toEntries(modes), ([mode, modeVars]) => {
      const merged = { ...vars, ...modeVars }
      const changed = Array.filter(groups, ([, group]) => isChanged(group, vars, merged))
      return Match.value(changed.length).pipe(
        Match.when(0, () => Option.none()),
        Match.orElse(() => Option.some(`    ${mode}: ${getLayerSource(changed, merged, "    ")}`))
      )
    })
  )
  return [
    `import { Tokens } from ${JSON.stringify(tokensImport)}`,
    'import * as Theme from "@weft/design-system/Theme"',
    'import { Layer } from "effect"',
    "",
    `export const ${getIdentifier(name)} = Theme.make(Tokens, {`,
    `  name: ${JSON.stringify(name)},`,
    ...Match.value(isDefault).pipe(
      Match.when(true, () => ["  default: true,"]),
      Match.orElse(() => [])
    ),
    `  layer: ${getLayerSource(groups, vars, "  ")}${Match.value(modeSources.length).pipe(
      Match.when(0, () => ""),
      Match.orElse(() => ",")
    )}`,
    ...Match.value(modeSources.length).pipe(
      Match.when(0, () => []),
      Match.orElse(() => ["  modes: {", modeSources.join(",\n"), "  }"])
    ),
    "})",
    ""
  ].join("\n")
}
