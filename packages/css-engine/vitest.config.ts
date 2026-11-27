import { defineConfig } from "vitest/config"
import { cssEngine } from "./src/vite.build.ts"

export default defineConfig({
  plugins: [cssEngine({ include: /\.style\.fixture\.ts$/, adapter: "./adapter.fixture.ts" })],
  test: { include: ["test/**/*.test.ts", "src/**/*.test.ts"] }
})
