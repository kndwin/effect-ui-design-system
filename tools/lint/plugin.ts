// Local oxlint plugin, written with effect-oxlint. Loaded through `jsPlugins` in .oxlintrc.json.
import { existsSync } from "node:fs"
import { dirname, join, parse } from "node:path"
import * as Effect from "effect/Effect"
import { Diagnostic, Plugin, Rule, RuleContext } from "effect-oxlint"
import { allowedList, isGoverned, kindOf } from "./file-kinds.pure.ts"

/** The nearest `doc` file in `dir` or an ancestor. */
const findDoc = (dir: string, doc: string): string | undefined => {
  for (let d = dir; d !== parse(d).root; d = dirname(d)) {
    if (existsSync(join(d, doc))) return join(d, doc)
  }
  return undefined
}

const report = (node: any, message: string) =>
  Effect.gen(function* () {
    const ctx = yield* RuleContext
    yield* ctx.report(Diagnostic.make({ node, message }))
  })

/** Every source file must be one of the allowed kinds; tests live in test/, entries in apps/. */
const fileKind = Rule.define({
  name: "file-kind",
  meta: Rule.meta({ type: "problem", description: "Source files must use an allowed kind suffix." }),
  create: function* () {
    const ctx = yield* RuleContext
    const path = ctx.filename
    return {
      Program: (node: any) => {
        if (!isGoverned(path)) return Effect.void
        const kind = kindOf(path)
        if (kind === undefined) {
          return report(
            node,
            path.endsWith("/index.ts")
              ? "No barrel files: export from the file itself and add it to package.json `exports`."
              : `Unknown file kind. Rename to one of: ${allowedList}.`
          )
        }
        const name = "name" in kind ? kind.name : kind.suffix
        const inTest = /\/test\//.test(path)
        if ((name === ".test.ts" || name === ".test-d.ts") !== inTest)
          return report(node, inTest ? "Files in test/ must be *.test.ts or *.test-d.ts." : "Tests belong in test/.")
        if (name === "main.ts" && !/\/apps\//.test(path)) return report(node, "main.ts is for app entries (apps/*).")
        if ("doc" in kind && findDoc(dirname(path), kind.doc) === undefined)
          return report(node, `*${name} files need a ${kind.doc} in this folder or an ancestor, explaining the rule.`)
        return Effect.void
      }
    }
  }
})

// ─── *.pure.ts ─────────────────────────────────────────────────────────────

const ambient = new Set([
  "window",
  "document",
  "navigator",
  "localStorage",
  "sessionStorage",
  "fetch",
  "console",
  "process",
  "globalThis"
])

/** A .pure.ts file: no ambient effects, no module state, no top-level statements. */
const pure = Rule.define({
  name: "pure",
  meta: Rule.meta({ type: "problem", description: "*.pure.ts files contain only pure functions and data." }),
  create: function* () {
    yield* RuleContext
    return {
      Identifier: (node: any) => {
        const p = node.parent
        const isProperty =
          (p?.type === "MemberExpression" && p.property === node && !p.computed) ||
          (p?.type === "Property" && p.key === node && !p.computed) ||
          p?.type === "TSPropertySignature" ||
          p?.type?.startsWith("Import") ||
          p?.type?.startsWith("Export")
        return !isProperty && ambient.has(node.name)
          ? report(
              node,
              `\`${node.name}\` is an ambient effect: not allowed in a .pure.ts file. Move it to a .component.ts (as a Command) or main.ts.`
            )
          : Effect.void
      },
      MemberExpression: (node: any) => {
        const obj = node.object?.name
        const prop = node.property?.name
        return (obj === "Math" && prop === "random") || (obj === "Date" && prop === "now")
          ? report(node, `\`${obj}.${prop}\` is non-deterministic: not allowed in a .pure.ts file.`)
          : Effect.void
      },
      NewExpression: (node: any) =>
        node.callee?.name === "Date"
          ? report(node, "`new Date()` is non-deterministic: not allowed in a .pure.ts file.")
          : Effect.void,
      VariableDeclaration: (node: any) =>
        node.parent?.type === "Program" || node.parent?.parent?.type === "Program"
          ? node.kind === "const"
            ? Effect.void
            : report(node, `Top-level \`${node.kind}\` is module state: use const in a .pure.ts file.`)
          : Effect.void,
      ExpressionStatement: (node: any) =>
        node.parent?.type === "Program" && !node.directive
          ? report(node, "Top-level statements run on import: not allowed in a .pure.ts file.")
          : Effect.void
    }
  }
})

/** vanilla-extract only in *.css.ts and the *.vanilla.ts APIs they call. */
const vanillaImports = Rule.define({
  name: "vanilla-imports",
  meta: Rule.meta({
    type: "problem",
    description: "@vanilla-extract/* may only be imported by *.css.ts and *.vanilla.ts."
  }),
  create: function* () {
    const ctx = yield* RuleContext
    const allowed = !isGoverned(ctx.filename) || /\.(css|vanilla)\.ts$/.test(ctx.filename)
    return {
      ImportDeclaration: (node: any) =>
        !allowed &&
        node.importKind !== "type" &&
        typeof node.source?.value === "string" &&
        node.source.value.startsWith("@vanilla-extract/")
          ? report(node, "vanilla-extract is a build detail: use Style.make / Theme.make; only tools/vite imports it.")
          : Effect.void
    }
  }
})

// ─── component styles ──────────────────────────────────────────────────────

const RAW_VALUE = /#[0-9a-f]{3,8}\b|(?<![\w-])-?\d*\.?\d+(px|rem|em|ms|s)\b|\b(rgb|rgba|hsl|hsla|oklch)\(/i
const DISABLE = /\b(eslint|oxlint)-disable/

const check = (node: any, text: unknown) => {
  const match = typeof text === "string" ? text.match(RAW_VALUE) : null
  return match
    ? report(
        node,
        `Raw value ${JSON.stringify(match[0])}: use a token from contract.token.ts. Need one that doesn't exist? Stop and ask; don't hard-code a value.`
      )
    : Effect.void
}

/** Component styles may only use tokens, and lint can't be switched off in them. */
const tokensOnly = Rule.define({
  name: "tokens-only",
  meta: Rule.meta({ type: "problem", description: "Component styles may only use tokens." }),
  create: function* () {
    const ctx = yield* RuleContext
    return {
      Program: (node: any) =>
        Effect.forEach(
          ctx.sourceCode.getAllComments().filter((c: any) => DISABLE.test(c.value)),
          () => report(node, "Lint can't be switched off in component styles."),
          { discard: true }
        ),
      Literal: (node: any) => check(node, node.value),
      TemplateElement: (node: any) => check(node, node.value?.cooked)
    }
  }
})

export default Plugin.define({
  name: "acme",
  rules: { "file-kind": fileKind, pure, "vanilla-imports": vanillaImports, "tokens-only": tokensOnly }
})
