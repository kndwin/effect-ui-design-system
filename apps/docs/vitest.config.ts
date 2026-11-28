import { makePlugin } from "@weft/css-engine/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  define: { "import.meta.env.VITE_WEFT_RELEASE": JSON.stringify("main") },
  plugins: [makePlugin({ include: /\.(component\.style|theme)\.ts$/, adapter: "@weft/design-system/Compile" })],
  test: { pool: "threads", fsModuleCache: false, include: ["src/**/*.test.ts", "test/**/*.test.ts"] }
})
