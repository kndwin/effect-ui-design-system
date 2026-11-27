import type { Decl } from "@acme/design-system/Rule"
import { Spacing } from "../../platform/token/contract.token.ts"
import type { ComposeSpaceVariantsInput } from "./space.schema.ts"

type Length = NonNullable<Decl["gap"]>

export const composeSpaceVariants = ({ property }: ComposeSpaceVariantsInput) => {
  const getRoot = (value: Length) => ({ root: { [property]: value } as Decl })
  return {
    "0": getRoot(0),
    "1": getRoot(Spacing[1]),
    "2": getRoot(Spacing[2]),
    "3": getRoot(Spacing[3]),
    "4": getRoot(Spacing[4]),
    "6": getRoot(Spacing[6]),
    "8": getRoot(Spacing[8]),
    "12": getRoot(Spacing[12])
  }
}
