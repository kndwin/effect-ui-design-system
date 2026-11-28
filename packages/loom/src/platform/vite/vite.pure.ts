import { Match } from "effect"
import type { GetEntrySourceInput, GetGlobBaseInput, GetPageHtmlInput } from "./vite.schema.ts"

export const getGlobBase = ({ glob }: GetGlobBaseInput) => {
  const segments = glob.split("/")
  const firstGlob = segments.findIndex((segment) => /[*?[{]/.test(segment))
  return Match.value(firstGlob).pipe(
    Match.when(-1, () => segments.slice(0, -1).join("/")),
    Match.orElse((index) => segments.slice(0, index).join("/"))
  )
}

const configImport = (config: string | null) =>
  Match.value(config).pipe(
    Match.when(null, () => "const config = { themes: [], loom: {} }"),
    Match.orElse((path) => `import config from ${JSON.stringify(`/@fs${path}`)}`)
  )

export const getEntrySource = ({ config, files }: GetEntrySourceInput) =>
  [
    `import { BrowserHost } from "@effect/ui/html"`,
    `import { Effect, Layer } from "effect"`,
    `import { App } from "@weft/loom/App"`,
    `import { LoomRegistry } from "@weft/loom/Canvas"`,
    configImport(config),
    ...files.map((file, index) => `import loom${index} from ${JSON.stringify(`/@fs${file}`)}`),
    `const looms = [${files.map((_, index) => `loom${index}`).join(", ")}]`,
    `const themes = (config.themes ?? []).map((theme) => ({ name: theme.name, modes: [...(theme.modes ?? [])] }))`,
    `const theme = config.loom?.theme?.name ?? themes[0]?.name ?? ""`,
    `const index = looms.map((loom) => ({ title: loom.title, scenarios: Object.keys(loom.scenarios) }))`,
    `BrowserHost.mount(App, { looms: index, themes, theme }, document.getElementById("root")).pipe(`,
    `  Layer.provide(Layer.succeed(LoomRegistry, looms)),`,
    `  Layer.launch,`,
    `  Effect.runFork`,
    `)`,
    ``
  ].join("\n")

export const getPageHtml = ({ entry }: GetPageHtmlInput) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Weft Loom</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`
