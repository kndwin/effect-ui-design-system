import { cssEngine } from "@acme/css-engine/vite"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [cssEngine({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/design-system/Compile" })],
  test: { include: ["test/**/*.test.ts", "src/**/*.test.ts"] }
})
