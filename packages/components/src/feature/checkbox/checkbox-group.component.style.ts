import * as Style from "@acme/design-system/Style"
import { Spacing } from "../../platform/token/contract.token.ts"
import { CheckboxGroupParts } from "./checkbox-group.parts.constant.ts"

export const CheckboxGroupStyle = Style.make(CheckboxGroupParts)({
  base: {
    root: { display: "flex", flexDirection: "column", gap: Spacing[2], states: { disabled: { opacity: 0.6 } } },
    items: { display: "flex", flexDirection: "column", gap: Spacing[2], paddingInlineStart: Spacing[6] }
  }
})
