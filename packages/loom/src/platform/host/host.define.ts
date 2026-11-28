import { Html } from "@effect/ui/html"
import { HostMessageSchema, HostModelSchema, HostPropsSchema } from "./host.schema.ts"

export const HostDef = Html.component({
  name: "Loom",
  props: HostPropsSchema,
  model: HostModelSchema,
  message: HostMessageSchema
})
