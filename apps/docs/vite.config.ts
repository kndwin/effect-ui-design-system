import { defineConfig } from "vite"
import { acmeStyles } from "../../tools/vite/acme-styles.ts"

export default defineConfig({ plugins: [acmeStyles()] })
