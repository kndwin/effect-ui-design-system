import { Schema } from "effect"
export const ToneSchema = Schema.Literals(["primary", "neutral", "danger", "ghost"])

export const ControlSizeSchema = Schema.Literals(["sm", "md"])
export const AvatarSizeSchema = Schema.Literals(["sm", "md", "lg"])
export const ShapeSchema = Schema.Literals(["circle", "square"])
export const HueSchema = Schema.Literals(["blue", "green", "amber", "rose"])
export const OrientationSchema = Schema.Literals(["horizontal", "vertical"])
export const CodeToneSchema = Schema.Literals(["default", "destructive"])

export const SpaceSchema = Schema.Literals(["0", "1", "2", "3", "4", "6", "8", "12"])
export const DirectionSchema = Schema.Literals(["row", "column"])
export const AlignSchema = Schema.Literals(["start", "center", "end", "stretch", "baseline"])
export const JustifySchema = Schema.Literals(["start", "center", "end", "between"])
export const ColumnsSchema = Schema.Literals(["1", "2", "3", "4", "5", "auto"])
export const SpanSchema = Schema.Literals(["1", "2", "3", "4", "full"])
export const SurfaceSchema = Schema.Literals(["none", "base", "muted", "card"])
export const SideSchema = Schema.Literals(["start", "end"])

export const TextSizeSchema = Schema.Literals(["xs", "sm", "md", "lg", "xl", "2xl"])
export const TextToneSchema = Schema.Literals(["default", "muted", "accent", "danger"])
export const TextWeightSchema = Schema.Literals(["regular", "medium", "semibold"])
