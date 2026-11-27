// Page metadata and the real source files the docs show. Everything shown as code
// is imported with ?raw, so the docs can't drift from what's in the repo.
import avatarStyle from "../../../packages/components/src/avatar.css.ts?source"
import buttonStyle from "../../../packages/components/src/button.css.ts?source"
import contract from "../../../packages/components/src/tokens.ts?source"
import astryxTheme from "../../../packages/themes/astryx/src/theme.css.ts?source"
import shadcnTheme from "../../../packages/themes/shadcn/src/theme.css.ts?source"

export interface Page {
  readonly id: string
  readonly section: "Getting started" | "Components" | "Foundations"
  readonly title: string
  readonly lead: string
  /** for component pages: the manifest entry and the component's style file */
  readonly kit?: string
  readonly style?: string
}

export const pages: ReadonlyArray<Page> = [
  {
    id: "introduction",
    section: "Getting started",
    title: "Introduction",
    lead: "Typed, themeable styles for @effect/ui-kit. Components are written against a token contract; themes fill the contract in. Swap the theme, keep the components."
  },
  {
    id: "theming",
    section: "Getting started",
    title: "Theming",
    lead: "A theme is a package that fills in every token of the contract, with optional modes layered on top. It is checked by the compiler, and bad values fail the build."
  },
  {
    id: "button",
    section: "Components",
    title: "Button",
    lead: "A native button with tones and sizes. Loading keeps it focusable and marks it busy.",
    kit: "Button",
    style: buttonStyle
  },
  {
    id: "avatar",
    section: "Components",
    title: "Avatar",
    lead: "A picture with initials until it loads. The initials and their colour come from the name; the root carries data-status so styles can follow the load.",
    kit: "Avatar",
    style: avatarStyle
  },
  {
    id: "tokens",
    section: "Foundations",
    title: "Tokens",
    lead: "Every token in the contract, and the value each theme gives it."
  }
]

export const sources = { contract, themes: { shadcn: shadcnTheme, astryx: astryxTheme } }

export const install = `pnpm add @acme/components @acme/theme-shadcn

// main.ts
import "@acme/theme-shadcn"

// anywhere in a view
import { Avatar, Button } from "@acme/components"

h.div.attr("data-theme", "shadcn").attr("data-mode", "dark").children(
  Avatar(h, { name: "Ada Lovelace", src: user.photo }),
  Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" }),
)`
