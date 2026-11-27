import { makePlugin } from "@weft/css-engine/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [makePlugin({ include: /\.(component\.style|theme)\.ts$/, adapter: "@weft/design-system/Compile" })],
  test: { pool: "threads", fsModuleCache: false, include: ["test/**/*.test.ts", "src/**/*.test.ts"] }
})
