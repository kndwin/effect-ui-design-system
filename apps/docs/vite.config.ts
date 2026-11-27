import { cssEngine } from "@acme/css-engine/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [cssEngine({ include: /\.(component\.style|theme)\.ts$/, adapter: "@acme/ds/Compile" })]
})
