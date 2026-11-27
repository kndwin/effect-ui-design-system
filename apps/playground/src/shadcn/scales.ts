// 🔒 Button-local scales (shadcn names). These are "local variants" in the open-question sense.
import { Schema } from "effect"
export const ButtonVariant = Schema.Literals(["default", "destructive", "outline", "secondary", "ghost", "link"])
export const ButtonSize = Schema.Literals(["default", "sm", "lg", "icon"])
