import * as Kit from "@weft/design-system/Kit"

const FormDescriptor = Kit.make({
  name: "Form",
  parts: { root: { states: {} } },
  vars: {},
  pseudo: []
})

export interface FormParts extends Kit.Type<typeof FormDescriptor> {}
export const FormParts: FormParts = FormDescriptor
