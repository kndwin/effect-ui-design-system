import type { Decl } from "@acme/design-system/Rule"
import { Spacing } from "../contract.token.ts"

type Length = NonNullable<Decl["gap"]>

export const space = (rule: (value: Length) => Decl) => ({
  "0": { root: rule(0) },
  "1": { root: rule(Spacing[1]) },
  "2": { root: rule(Spacing[2]) },
  "3": { root: rule(Spacing[3]) },
  "4": { root: rule(Spacing[4]) },
  "6": { root: rule(Spacing[6]) },
  "8": { root: rule(Spacing[8]) },
  "12": { root: rule(Spacing[12]) }
})
