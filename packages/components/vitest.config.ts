import { defineConfig } from "vitest/config"
import { acmeStyles } from "../../tools/vite/acme-styles.ts"

export default defineConfig({ plugins: [acmeStyles()], test: { include: ["test/**/*.test.ts"] } })
