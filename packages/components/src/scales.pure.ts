// 🔒 Shared scales: the same Schemas apps can use in their Models.
import { Schema } from "effect"
export const Tone = Schema.Literals(["primary", "neutral", "danger", "ghost"])
/** Button and CodeBlock sizes (not the Size token group) */
export const ControlSize = Schema.Literals(["sm", "md"])
export const AvatarSize = Schema.Literals(["sm", "md", "lg"])
export const Shape = Schema.Literals(["circle", "square"])
export const Hue = Schema.Literals(["blue", "green", "amber", "rose"])
export const CodeTone = Schema.Literals(["default", "destructive"])

// layout
export const Space = Schema.Literals(["0", "1", "2", "3", "4", "6", "8", "12"])
export const Direction = Schema.Literals(["row", "column"])
export const Align = Schema.Literals(["start", "center", "end", "stretch", "baseline"])
export const Justify = Schema.Literals(["start", "center", "end", "between"])
export const Columns = Schema.Literals(["1", "2", "3", "4", "5", "auto"])
export const Span = Schema.Literals(["1", "2", "3", "4", "full"])
export const Surface = Schema.Literals(["none", "base", "muted", "card"])
export const Side = Schema.Literals(["start", "end"])
// text
export const TextSize = Schema.Literals(["xs", "sm", "md", "lg", "xl", "2xl"])
export const TextTone = Schema.Literals(["default", "muted", "accent", "danger"])
export const TextWeight = Schema.Literals(["regular", "medium", "semibold"])
