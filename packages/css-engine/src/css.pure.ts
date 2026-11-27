import type { GlobalRule, StyleRule } from "./rules.pure.ts"

const unitless = new Set([
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
])

const nested = new Set(["vars", "selectors", "@media"])

export const property = (name: string): string =>
  name.startsWith("--")
    ? name
    : name
        .replace(/^(Webkit|Moz|ms)(?=[A-Z])/, (prefix) => `-${prefix.toLowerCase()}`)
        .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

export const value = (name: string, input: unknown): string =>
  typeof input === "number" && input !== 0 && !unitless.has(name) ? `${input}px` : String(input)

export const declarations = (style: StyleRule): string =>
  [
    ...Object.entries(style.vars ?? {}).map(([name, v]) => `${name}:${v}`),
    ...Object.entries(style)
      .filter(([name, v]) => !nested.has(name) && v !== undefined && v !== null)
      .map(([name, v]) => `${property(name)}:${value(name, v)}`)
  ].join(";")

export const rules = (selector: string, style: StyleRule): ReadonlyArray<string> => {
  const own = declarations(style)
  return [
    ...(own ? [`${selector}{${own}}`] : []),
    ...Object.entries(style.selectors ?? {}).flatMap(([nestedSelector, s]) =>
      rules(nestedSelector.replaceAll("&", selector), s)
    ),
    ...Object.entries(style["@media"] ?? {}).map(([query, s]) => `@media ${query}{${rules(selector, s).join("")}}`)
  ]
}

export const globalRules = (rule: GlobalRule): ReadonlyArray<string> =>
  rules(rule.selector, { ...rule.style, ...(rule.vars ? { vars: rule.vars } : {}) })
