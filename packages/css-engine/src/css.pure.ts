import { Array, HashSet, Predicate, Record } from "effect"
import type { GlobalRule, StyleRule } from "./rules.pure.ts"

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

export const property = (name: string): string =>
  name.startsWith("--")
    ? name
    : name
        .replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (prefix) => `-${prefix.toLowerCase()}`)
        .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

export const value = (name: string, input: unknown): string =>
  typeof input === "number" && input !== 0 && !HashSet.has(unitless, name) ? `${input}px` : String(input)

export const declarations = (style: StyleRule): string =>
  [
    ...Record.collect(style.vars ?? {}, (name, v) => `${name}:${v}`),
    ...Record.toEntries(style)
      .filter(([name, v]) => !HashSet.has(nested, name) && Predicate.isNotNullish(v))
      .map(([name, v]) => `${property(name)}:${value(name, v)}`)
  ].join(";")

export const rules = (selector: string, style: StyleRule): ReadonlyArray<string> => {
  const own = declarations(style)
  return [
    ...(own ? [`${selector}{${own}}`] : []),
    ...Array.flatten(
      Record.collect(style.selectors ?? {}, (nestedSelector, s) => rules(nestedSelector.replaceAll("&", selector), s))
    ),
    ...Record.collect(style["@media"] ?? {}, (query, s) => `@media ${query}{${rules(selector, s).join("")}}`)
  ]
}

export const globalRules = (rule: GlobalRule): ReadonlyArray<string> =>
  rules(rule.selector, { ...rule.style, ...(rule.vars ? { vars: rule.vars } : {}) })
