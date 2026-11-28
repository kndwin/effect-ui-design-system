import { makePlugin as makeStylePlugin } from "@weft/css-engine/vite"
import { makePlugin as makeLoomPlugin } from "@weft/loom/vite"
import type { PluginOption } from "vite"

export const makePlugin = (options: { readonly config?: string; readonly route?: string } = {}): PluginOption => [
  makeStylePlugin({ include: /\.(component\.style|theme)\.ts$/, adapter: "@weft/design-system/Compile" }),
  makeLoomPlugin(options)
]
