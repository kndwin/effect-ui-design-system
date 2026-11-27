import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin"
import { defineConfig } from "vite"
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  build: { rollupOptions: { input: { main: "index.html", shadcn: "shadcn.html" } } }
})
