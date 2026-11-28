import { defineConfig } from "vitest/config"

export default defineConfig({
  test: { pool: "threads", fsModuleCache: false, include: ["src/**/*.test.ts"] }
})
