import { defineConfig } from "vitest/config"
import { makePlugin } from "./src/platform/vite/vite.build.ts"

export default defineConfig({
  plugins: [makePlugin({ include: /\.style\.fixture\.ts$/, adapter: "./adapter.fixture.ts" })],
  test: { pool: "threads", fsModuleCache: false, include: ["test/**/*.test.ts", "src/**/*.test.ts"] }
})
