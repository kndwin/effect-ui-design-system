import { SelectDef } from "./select.define.ts"
import { SelectEventsSchema } from "./select.schema.ts"

export const update = SelectDef.update({
  RequestedOpen: ($) => $.evolve({ open: true }),
  RequestedClose: ($) => $.evolve({ open: false }),
  PickedValue: ($, { value }) => $.evolve({ open: false }).emit(SelectEventsSchema.Picked({ value }))
})
