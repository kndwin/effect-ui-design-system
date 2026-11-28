import type * as Loom from "../loom/loom.make.ts"
import { HostDef } from "./host.define.ts"

export const view = HostDef.view((h, model) => (h.props.loom as Loom.Loom).render(h, model))
