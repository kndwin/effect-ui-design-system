import type { Html } from "@effect/ui/html"

const logoWarp = "M12.5 4.5V27.5M19.5 4.5V27.5"
const logoWeft = "M4.5 8.5H23.25a3.75 3.75 0 0 1 0 7.5H8.75a3.75 3.75 0 0 0 0 7.5H27.5"
const logoWarpCuts: ReadonlyArray<readonly [number, number, number, number]> = [
  [10.4, 5.5, 4.2, 6],
  [17.4, 13, 4.2, 6],
  [10.4, 20.5, 4.2, 6]
]
const logoWeftCuts: ReadonlyArray<readonly [number, number, number, number]> = [
  [16.5, 6.4, 6, 4.2],
  [9.5, 13.9, 6, 4.2],
  [16.5, 21.4, 6, 4.2]
]

const LogoMask = <Msg>(h: Html.H<Msg>, id: string, cuts: ReadonlyArray<readonly [number, number, number, number]>) =>
  h.mask
    .attr("id", id)
    .attr("maskUnits", "userSpaceOnUse")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", "32")
    .attr("height", "32")
    .children(
      h.rect.attr("width", "32").attr("height", "32").attr("fill", "#fff"),
      ...cuts.map(([x, y, width, height]) =>
        h.rect
          .attr("x", String(x))
          .attr("y", String(y))
          .attr("width", String(width))
          .attr("height", String(height))
          .attr("fill", "#000")
      )
    )

export const Logo = <Msg>(h: Html.H<Msg>, size: number) =>
  h.svg
    .attr("viewBox", "0 0 32 32")
    .attr("width", String(size))
    .attr("height", String(size))
    .attr("fill", "none")
    .attr("stroke-width", "3.2")
    .attr("stroke-linecap", "round")
    .attr("aria-hidden", "true")
    .children(
      LogoMask(h, "weft-logo-warp", logoWarpCuts),
      LogoMask(h, "weft-logo-weft", logoWeftCuts),
      h.path.attr("d", logoWarp).attr("stroke", "var(--color-fgMuted)").attr("mask", "url(#weft-logo-warp)"),
      h.path.attr("d", logoWeft).attr("stroke", "var(--color-fg)").attr("mask", "url(#weft-logo-weft)")
    )
