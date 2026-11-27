import * as Style from "@weft/design-system/Style"
import { Font, Size, Spacing } from "../../platform/token/contract.token.ts"
import { FormParts } from "./form.parts.constant.ts"

export const FormStyle = Style.make(FormParts)({
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: Spacing[4],
      width: "100%",
      maxWidth: Size.column,
      fontFamily: Font.body
    }
  }
})
