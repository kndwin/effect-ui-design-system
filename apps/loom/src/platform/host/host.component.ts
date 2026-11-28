import type * as Loom from "@weft/loom/Loom"
import { HostDef } from "./host.define.ts"
import { update } from "./host.update.ts"
import { view } from "./host.view.ts"

export const LoomHost = HostDef.make({
  init: ($) => ({ ...($.props.loom as Loom.Loom).args, ...$.props.args }),
  update,
  view
})
