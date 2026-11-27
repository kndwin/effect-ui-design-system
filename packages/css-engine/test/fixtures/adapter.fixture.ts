import type { Output } from "../../src/rules.pure.ts"

export const compile = (value: unknown, exportName: string): Output | undefined => {
  if (typeof value !== "object" || value === null || !("card" in value)) return undefined
  const { color } = (value as { card: { color: string } }).card
  return {
    runtime: { name: exportName },
    recipesAt: "classes",
    recipes: {
      root: {
        kind: "recipe",
        debugId: `${exportName}_root`,
        base: { color, selectors: { "&:hover": { opacity: 0.8 } } },
        variants: { size: { sm: { padding: 4 }, lg: { padding: 16 } } },
        defaultVariants: { size: "sm" },
        compoundVariants: []
      }
    },
    globals: [{ kind: "global", selector: ":root", vars: { "--card-color": color } }]
  }
}
