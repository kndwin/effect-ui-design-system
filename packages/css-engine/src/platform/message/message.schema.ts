import { Schema } from "effect"

export const MapCauseToMessageInputSchema = Schema.Struct({ cause: Schema.Unknown })
export type MapCauseToMessageInput = typeof MapCauseToMessageInputSchema.Type
