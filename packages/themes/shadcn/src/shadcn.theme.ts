import { Tokens } from "@acme/components/tokens"
import * as Theme from "@acme/design-system/Theme"

export const shadcn = Theme.make(Tokens, {
  name: "shadcn",
  default: true,
  values: {
    Colors: {
      surface: "oklch(1 0 0)",
      surfaceMuted: "oklch(0.97 0 0)",
      fg: "oklch(0.145 0 0)",
      fgMuted: "oklch(0.556 0 0)",
      border: "oklch(0.922 0 0)",
      accent: "oklch(0.205 0 0)",
      accentFg: "oklch(0.985 0 0)",
      danger: "oklch(0.577 0.245 27.325)",
      dangerFg: "oklch(1 0 0)",
      ring: "oklch(0.708 0 0)"
    },

    Code: {
      surface: "oklch(0.985 0 0)",
      fg: "oklch(0.145 0 0)",
      muted: "oklch(0.556 0 0)",
      border: "oklch(0.922 0 0)",
      lineHighlighted: "oklch(0.205 0 0 / 6%)",
      lineAdded: "oklch(0.723 0.219 149.579 / 14%)",
      lineRemoved: "oklch(0.637 0.237 25.331 / 14%)"
    },
    Syntax: {
      comment: "#6e7781",
      string: "#0a3069",
      keyword: "#cf222e",
      number: "#0550ae",
      type: "#953800",
      call: "#8250df"
    },
    Hues: {
      blue: "oklch(0.488 0.243 264.376)",
      green: "oklch(0.6 0.118 184.704)",
      amber: "oklch(0.646 0.222 41.116)",
      rose: "oklch(0.645 0.246 16.439)",
      onHue: "oklch(0.985 0 0)"
    },
    Spacing: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 },
    Size: {
      controlSm: 32,
      controlMd: 36,
      avatarSm: 24,
      avatarMd: 32,
      avatarLg: 40,
      header: 56,
      sidebar: 240,
      panel: 360,
      content: 820,
      column: 280
    },
    Radius: { control: 8, avatarSquare: 8, container: 14, full: 9999 },
    Stroke: { border: 1, focus: 3, focusOffset: 0 },
    Text: {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "2rem",
      code: "0.8125rem"
    },
    Font: {
      body: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
    },
    Weight: { regular: 400, medium: 500, semibold: 600 },
    Shadow: { control: "0 1px 2px 0 rgb(0 0 0 / 0.05)" },
    Motion: { fast: "150 millis" }
  },
  modes: {
    dark: {
      Colors: {
        surface: "oklch(0.145 0 0)",
        surfaceMuted: "oklch(0.269 0 0)",
        fg: "oklch(0.985 0 0)",
        fgMuted: "oklch(0.708 0 0)",
        border: "oklch(1 0 0 / 10%)",
        accent: "oklch(0.922 0 0)",
        accentFg: "oklch(0.205 0 0)",
        danger: "oklch(0.704 0.191 22.216)",
        dangerFg: "oklch(1 0 0)",
        ring: "oklch(0.556 0 0)"
      },
      Code: {
        surface: "oklch(0.205 0 0)",
        fg: "oklch(0.985 0 0)",
        muted: "oklch(0.708 0 0)",
        border: "oklch(1 0 0 / 10%)",
        lineHighlighted: "oklch(1 0 0 / 7%)",
        lineAdded: "oklch(0.723 0.219 149.579 / 18%)",
        lineRemoved: "oklch(0.637 0.237 25.331 / 18%)"
      },
      Syntax: {
        comment: "#8b949e",
        string: "#a5d6ff",
        keyword: "#ff7b72",
        number: "#79c0ff",
        type: "#ffa657",
        call: "#d2a8ff"
      },
      Hues: {
        blue: "oklch(0.488 0.243 264.376)",
        green: "oklch(0.696 0.17 162.48)",
        amber: "oklch(0.769 0.188 70.08)",
        rose: "oklch(0.645 0.246 16.439)"
      }
    }
  }
})
