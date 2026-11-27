import { Schema } from "effect"

export const GetMessageInput = Schema.Struct({ cause: Schema.Unknown })
export type GetMessageInput = typeof GetMessageInput.Type
