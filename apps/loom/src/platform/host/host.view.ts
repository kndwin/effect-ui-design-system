import type * as Loom from "@weft/loom/Loom"
import { HostDef } from "./host.define.ts"

export const view = HostDef.view((h, model) => (h.props.loom as Loom.Loom).render(h, model))
