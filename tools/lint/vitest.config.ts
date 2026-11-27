import { defineConfig } from "vitest/config"

export default defineConfig({
  test: { pool: "threads", root: import.meta.dirname, include: ["src/**/*.test.ts", "test/**/*.test.ts"] }
})
