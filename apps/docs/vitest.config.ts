import { makePlugin } from "@acme/css-engine/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [makePlugin({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/design-system/Compile" })],
  test: { pool: "threads", fsModuleCache: false, include: ["src/**/*.test.ts", "test/**/*.test.ts"] }
})
