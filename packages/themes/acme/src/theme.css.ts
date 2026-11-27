// 🔒 Acme: violet accent, Inter, 8px corners. The default theme (also on :root).
import { Tokens } from "@acme/components/tokens"
import { Theme } from "@acme/ds"

export const acme = Theme.make(Tokens, {
  name: "acme",
  default: true,
  values: {
    Colors: {
      surface: "#ffffff", surfaceMuted: "#f4f4f5", fg: "#09090b", fgMuted: "#52525b", border: "#e4e4e7",
      accent: "#6d4aff", accentFg: "#ffffff", danger: "#dc2626", dangerFg: "#ffffff", ring: "#6d4aff"
    },
    Hues: { blue: "#3b82f6", green: "#16a34a", amber: "#d97706", rose: "#e11d48", onHue: "#ffffff" },
    Spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24 },
    Size: { controlSm: 32, controlMd: 36, avatarSm: 24, avatarMd: 32, avatarLg: 48 },
    Radius: { control: 8, avatarSquare: 8, full: 9999 },
    Stroke: { border: 1, focus: 2, focusOffset: 2 },
    Text: { xs: "0.75rem", sm: "0.875rem", md: "1.125rem" },
    Font: { body: ["Inter", "system-ui", "sans-serif"] },
    Weight: { medium: 500, semibold: 600 },
    Shadow: { control: "0 1px 2px 0 rgb(0 0 0 / 0.08)" },
    Motion: { fast: "150 millis" }
  },
  modes: {
    dark: {
      Colors: {
        surface: "#151518", surfaceMuted: "#222227", fg: "#f4f4f5", fgMuted: "#a1a1aa", border: "#2e2e33",
        accent: "#7c5cff", accentFg: "#ffffff", danger: "#ef4444", dangerFg: "#ffffff", ring: "#9b85ff"
      },
      Shadow: { control: "none" }
    }
  }
})
