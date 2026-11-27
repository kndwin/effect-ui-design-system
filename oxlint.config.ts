import { defineConfig } from "oxlint"
import { ruleIds } from "./tools/lint/src/feature/oxlint/plugin.build.ts"

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc", "import"],
  categories: { correctness: "error", suspicious: "warn" },
  ignorePatterns: ["vendor/**", "**/dist/**", "**/node_modules/**"],
  jsPlugins: ["./tools/lint/src/feature/oxlint/plugin.build.ts"],
  rules: {
    "typescript/no-explicit-any": "off",
    "import/no-unassigned-import": "off",
    "import/default": "off",
    "no-unused-vars": "error",
    eqeqeq: "error",
    ...Object.fromEntries(ruleIds.map((id) => [`acme/${id}`, "error" as const]))
  }
})
