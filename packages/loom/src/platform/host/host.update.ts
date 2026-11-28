import { HostDef } from "./host.define.ts"

export const update = HostDef.update(($, patch) => ({ ...$.model, ...patch }))
