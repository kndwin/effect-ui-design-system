import { Html } from "@effect/ui/html"
import { CodeBlockMessageSchema, CodeBlockModelSchema, CodeBlockPropsSchema } from "./code-block.schema.ts"

export const CodeBlockDef = Html.component({
  name: "CodeBlock",
  props: CodeBlockPropsSchema,
  model: CodeBlockModelSchema,
  message: CodeBlockMessageSchema
})
