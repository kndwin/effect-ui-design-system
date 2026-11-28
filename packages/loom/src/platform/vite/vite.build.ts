import { existsSync, readdirSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import type { Plugin, ViteDevServer } from "vite"
import { mapGlobToRegExp } from "./vite.pure.map.ts"
import { getEntrySource, getGlobBase, getPageHtml } from "./vite.pure.ts"

const virtualId = "virtual:weft/loom"
const resolvedId = `\u0000${virtualId}`
const defaultInclude = ["src/**/*.loom.ts"]

const scanFiles = (root: string, include: ReadonlyArray<string>) =>
  include.flatMap((glob) => {
    const base = resolve(root, getGlobBase({ glob }))
    const pattern = mapGlobToRegExp({ glob: relative(root, resolve(root, glob)) })
    if (!existsSync(base)) return []
    return readdirSync(base, { recursive: true, encoding: "utf8" })
      .map((file) => join(base, file))
      .filter((file) => pattern.test(relative(root, file)))
      .toSorted()
  })

const loadInclude = async (server: ViteDevServer, config: string | null): Promise<ReadonlyArray<string>> => {
  if (config === null) return defaultInclude
  const module = (await server.ssrLoadModule(config)) as {
    readonly default?: { readonly loom?: { readonly include?: ReadonlyArray<string> } }
  }
  return module.default?.loom?.include ?? defaultInclude
}

export const makePlugin = (options: { readonly config?: string; readonly route?: string } = {}): Plugin => {
  const route = options.route ?? "/__weft/loom"
  const state: { root: string; server: ViteDevServer | undefined } = { root: process.cwd(), server: undefined }
  const configPath = () => {
    const path = resolve(state.root, options.config ?? "weft.config.ts")
    if (!existsSync(path)) return null
    return path
  }
  return {
    name: "weft-loom",
    apply: "serve",
    configResolved: (config) => {
      state.root = config.root
    },
    configureServer: (server) => {
      state.server = server
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ""
        if (url.split("?")[0]?.replace(/\/$/, "") !== route) return next()
        server.transformIndexHtml(url, getPageHtml({ entry: `/@id/__x00__${virtualId}` })).then((html) => {
          res.setHeader("content-type", "text/html; charset=utf-8")
          res.end(html)
        }, next)
      })
      const refresh = (file: string) => {
        if (!file.endsWith(".loom.ts")) return
        const module = server.moduleGraph.getModuleById(resolvedId)
        if (module !== undefined) server.moduleGraph.invalidateModule(module)
        server.ws.send({ type: "full-reload" })
      }
      server.httpServer?.once("listening", () =>
        setTimeout(() => {
          for (const url of server.resolvedUrls?.local ?? [])
            server.config.logger.info(`  ➜  Loom:    ${url.replace(/\/$/, "")}${route}`)
        }, 0)
      )
      server.watcher.on("add", refresh)
      server.watcher.on("unlink", refresh)
    },
    resolveId: (id) => {
      if (id === virtualId) return resolvedId
      return undefined
    },
    load: async (id) => {
      if (id !== resolvedId || state.server === undefined) return undefined
      const config = configPath()
      const include = await loadInclude(state.server, config)
      return getEntrySource({ config, files: scanFiles(state.root, include) })
    }
  }
}
