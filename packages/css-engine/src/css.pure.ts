import { Array, HashSet, Match, Predicate, Record } from "effect"
import type {
  GetDeclarationsInput,
  GetGlobalRulesInput,
  GetPropertyNameInput,
  GetPropertyValueInput,
  GetRulesInput
} from "./css.schema.ts"

const unitless = HashSet.make(
  "animationIterationCount",
  "aspectRatio",
  "columnCount",
  "fillOpacity",
  "flex",
  "flexGrow",
  "flexShrink",
  "fontWeight",
  "gridColumn",
  "gridRow",
  "lineHeight",
  "opacity",
  "order",
  "orphans",
  "strokeOpacity",
  "tabSize",
  "widows",
  "zIndex",
  "zoom"
)

const nested = HashSet.make("vars", "selectors", "@media")

export const getPropertyName = ({ name }: GetPropertyNameInput): string =>
  Match.value(name.startsWith("--")).pipe(
    Match.when(true, () => name),
    Match.orElse(() =>
      name
        .replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (prefix) => `-${prefix.toLowerCase()}`)
        .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
    )
  )

export const getPropertyValue = ({ name, value }: GetPropertyValueInput): string =>
  Match.value(value).pipe(
    Match.when(
      (v: unknown): v is number => Predicate.isNumber(v) && v !== 0 && !HashSet.has(unitless, name),
      (n) => `${n}px`
    ),
    Match.orElse((other) => String(other))
  )

export const getDeclarations = ({ style }: GetDeclarationsInput): string =>
  [
    ...Record.collect(style.vars ?? {}, (name, v) => `${name}:${v}`),
    ...Record.toEntries(style)
      .filter(([name, v]) => !HashSet.has(nested, name) && Predicate.isNotNullish(v))
      .map(([name, v]) => `${getPropertyName({ name })}:${getPropertyValue({ name, value: v })}`)
  ].join(";")

export const getRules = ({ selector, style }: GetRulesInput): ReadonlyArray<string> => {
  const own = getDeclarations({ style })
  return [
    ...Match.value(own).pipe(
      Match.when("", () => []),
      Match.orElse((body) => [`${selector}{${body}}`])
    ),
    ...Array.flatten(
      Record.collect(style.selectors ?? {}, (nestedSelector, s) =>
        getRules({ selector: nestedSelector.replaceAll("&", selector), style: s })
      )
    ),
    ...Record.collect(
      style["@media"] ?? {},
      (query, s) => `@media ${query}{${getRules({ selector, style: s }).join("")}}`
    )
  ]
}

export const getGlobalRules = ({ rule }: GetGlobalRulesInput): ReadonlyArray<string> =>
  getRules({
    selector: rule.selector,
    style: {
      ...rule.style,
      ...Match.value(rule.vars).pipe(
        Match.when(undefined, () => ({})),
        Match.orElse((vars) => ({ vars }))
      )
    }
  })
