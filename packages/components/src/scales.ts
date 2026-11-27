// 🔒 Shared scales: the same Schemas apps can use in their Models.
import { Schema } from "effect"
export const Tone = Schema.Literals(["primary", "neutral", "danger"])
export const Size = Schema.Literals(["sm", "md"])
export const AvatarSize = Schema.Literals(["sm", "md", "lg"])
export const Shape = Schema.Literals(["circle", "square"])
export const Hue = Schema.Literals(["blue", "green", "amber", "rose"])
