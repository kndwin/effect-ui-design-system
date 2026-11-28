import * as WeftConfig from "@weft/cli/WeftConfig"
import { astryx } from "@weft/theme-astryx"
import { shadcn } from "@weft/theme-shadcn"

export default WeftConfig.make({
  themes: [shadcn, astryx],
  loom: { include: ["../../packages/components/src/**/*.loom.ts"] }
})
