import * as Alchemy from "alchemy"
import * as Cloudflare from "@alchemy.run/cloudflare"
import * as Effect from "effect/Effect"

export default Alchemy.Stack(
  "weft-docs",
  { providers: Cloudflare.providers(), state: Cloudflare.state() },
  Effect.gen(function* () {
    const site = yield* Cloudflare.Website.StaticSite("Docs", {
      name: "weft-docs",
      command: "pnpm run build",
      outdir: "dist",
      assets: { notFoundHandling: "single-page-application" },
      memo: {
        include: ["**/*", "../../packages/*/src/**", "../../vendor/effect-ui/packages/*/src/**"],
        lockfile: true
      }
    })
    return { url: site.url }
  })
)
