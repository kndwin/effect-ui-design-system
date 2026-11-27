import { Tokens } from "@weft/components/tokens"
import * as Theme from "@weft/design-system/Theme"
import { Layer } from "effect"

export const shadcn = Theme.make(Tokens, {
  name: "shadcn",
  default: true,
  layer: Layer.mergeAll(
    Layer.succeed(Tokens.Colors, {
      surface: "oklch(1 0 0)",
      surfaceMuted: "oklch(0.97 0 0)",
      fg: "oklch(0.145 0 0)",
      fgMuted: "oklch(0.556 0 0)",
      border: "oklch(0.922 0 0)",
      accent: "oklch(0.205 0 0)",
      accentFg: "oklch(0.985 0 0)",
      danger: "oklch(0.577 0.245 27.325)",
      dangerFg: "oklch(1 0 0)",
      ring: "oklch(0.708 0 0)",
      overlay: "rgb(0 0 0 / 0.45)"
    }),
    Layer.succeed(Tokens.Code, {
      surface: "oklch(0.985 0 0)",
      fg: "oklch(0.145 0 0)",
      muted: "oklch(0.556 0 0)",
      border: "oklch(0.922 0 0)",
      lineHighlighted: "oklch(0.205 0 0 / 6%)",
      lineAdded: "oklch(0.723 0.219 149.579 / 14%)",
      lineRemoved: "oklch(0.637 0.237 25.331 / 14%)"
    }),
    Layer.succeed(Tokens.Syntax, {
      comment: "#6e7781",
      string: "#0a3069",
      keyword: "#cf222e",
      number: "#0550ae",
      type: "#953800",
      call: "#8250df"
    }),
    Layer.succeed(Tokens.Hues, {
      blue: "oklch(0.488 0.243 264.376)",
      green: "oklch(0.6 0.118 184.704)",
      amber: "oklch(0.646 0.222 41.116)",
      rose: "oklch(0.645 0.246 16.439)",
      onHue: "oklch(0.985 0 0)"
    }),
    Layer.succeed(Tokens.Spacing, {
      "1": 4,
      "2": 8,
      "3": 12,
      "4": 16,
      "6": 24,
      "8": 32,
      "12": 48
    }),
    Layer.succeed(Tokens.Size, {
      controlSm: 32,
      controlMd: 36,
      avatarSm: 24,
      avatarMd: 32,
      avatarLg: 40,
      header: 56,
      sidebar: 240,
      panel: 360,
      content: 820,
      column: 280,
      check: 16,
      switchWidth: 32,
      switchHeight: 18,
      switchThumb: 14,
      sliderTrack: 4,
      sliderThumb: 16,
      field: 320,
      popup: 300,
      dialog: 480,
      drawer: 380,
      tooltip: 240
    }),
    Layer.succeed(Tokens.Radius, {
      check: 4,
      control: 8,
      avatarSquare: 8,
      container: 14,
      full: 9999
    }),
    Layer.succeed(Tokens.Stroke, {
      border: 1,
      focus: 3,
      focusOffset: 0
    }),
    Layer.succeed(Tokens.Text, {
      xs: "0.75rem",
      sm: "0.875rem",
      md: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "2rem",
      code: "0.8125rem"
    }),
    Layer.succeed(Tokens.Font, {
      body: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
      mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
    }),
    Layer.succeed(Tokens.Weight, {
      regular: 400,
      medium: 500,
      semibold: 600
    }),
    Layer.succeed(Tokens.Shadow, {
      overlay: "0 10px 30px -8px rgb(0 0 0 / 0.25)",
      control: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
    }),
    Layer.succeed(Tokens.Motion, {
      fast: "150 millis"
    })
  ),
  modes: {
    dark: Layer.mergeAll(
      Layer.succeed(Tokens.Colors, {
        surface: "oklch(0.145 0 0)",
        surfaceMuted: "oklch(0.269 0 0)",
        fg: "oklch(0.985 0 0)",
        fgMuted: "oklch(0.708 0 0)",
        border: "oklch(1 0 0 / 10%)",
        accent: "oklch(0.922 0 0)",
        accentFg: "oklch(0.205 0 0)",
        danger: "oklch(0.704 0.191 22.216)",
        dangerFg: "oklch(1 0 0)",
        ring: "oklch(0.556 0 0)",
        overlay: "rgb(0 0 0 / 0.45)"
      }),
      Layer.succeed(Tokens.Code, {
        surface: "oklch(0.205 0 0)",
        fg: "oklch(0.985 0 0)",
        muted: "oklch(0.708 0 0)",
        border: "oklch(1 0 0 / 10%)",
        lineHighlighted: "oklch(1 0 0 / 7%)",
        lineAdded: "oklch(0.723 0.219 149.579 / 18%)",
        lineRemoved: "oklch(0.637 0.237 25.331 / 18%)"
      }),
      Layer.succeed(Tokens.Syntax, {
        comment: "#8b949e",
        string: "#a5d6ff",
        keyword: "#ff7b72",
        number: "#79c0ff",
        type: "#ffa657",
        call: "#d2a8ff"
      }),
      Layer.succeed(Tokens.Hues, {
        blue: "oklch(0.488 0.243 264.376)",
        green: "oklch(0.696 0.17 162.48)",
        amber: "oklch(0.769 0.188 70.08)",
        rose: "oklch(0.645 0.246 16.439)",
        onHue: "oklch(0.985 0 0)"
      })
    )
  }
})
