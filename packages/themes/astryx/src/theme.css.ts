// 🔒 An Astryx-inspired theme (values from astryx.atmeta.com/docs/tokens, "Neutral"):
// near-black accent, Figtree, 14px base, 12px control corners, translucent borders.
import { Tokens } from "@acme/components/tokens"
import { Theme } from "@acme/ds"

export const astryx = Theme.make(Tokens, {
  name: "astryx",
  values: {
    Colors: {
      surface: "#ffffff", surfaceMuted: "#f1f1f1", fg: "#000000", fgMuted: "#474747", border: "#00000014",
      accent: "#1b1b1b", accentFg: "#ffffff", danger: "#c9303a", dangerFg: "#ffffff", ring: "#1b1b1b"
    },
    // data-viz categorical: blue, green, orange, red
    Hues: { blue: "#0171E3", green: "#0B991F", amber: "#EB6E00", rose: "#F5394F", onHue: "#ffffff" },
    Spacing: { 1: "0.25rem", 2: "0.5rem", 3: "0.75rem", 4: "1rem", 6: "1.5rem" },
    Size: { controlSm: 28, controlMd: 32, avatarSm: 24, avatarMd: 32, avatarLg: 40 },
    Radius: { control: 12, avatarSquare: 8, full: 9999 },
    Stroke: { border: 1, focus: 2, focusOffset: 3 },
    Text: { xs: "0.75rem", sm: "0.875rem", md: "1.0625rem" },
    Font: { body: ["Figtree", "system-ui", "sans-serif"] },
    Weight: { medium: 500, semibold: 600 },
    Shadow: { control: "none" },
    Motion: { fast: "175 millis" }
  },
  modes: {
    dark: {
      Colors: {
        surface: "#262626", surfaceMuted: "#1b1b1b", fg: "#ffffff", fgMuted: "#9e9e9e", border: "#ffffff1A",
        accent: "#f1f1f1", accentFg: "#111111", danger: "#ff705d", dangerFg: "#1b1b1b", ring: "#f1f1f1"
      },
      Hues: { blue: "#6d9cfe", green: "#64af4c" }
    }
  }
})
