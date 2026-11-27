import contract from "../../../../../packages/components/src/platform/token/contract.token.ts?raw"
import astryxTheme from "../../../../../packages/themes/astryx/src/astryx.theme.ts?raw"
import shadcnTheme from "../../../../../packages/themes/shadcn/src/shadcn.theme.ts?raw"
import { type ComponentId, ComponentIdSchema } from "./component.schema.ts"
import type { Page } from "./content.schema.ts"

const styles = import.meta.glob<string>("../../../../../packages/components/src/feature/*/*.component.style.ts", {
  eager: true,
  query: "?raw",
  import: "default"
})

const componentPages: {
  readonly [Id in ComponentId]: { readonly title: string; readonly kit: string; readonly lead: string }
} = {
  button: {
    title: "Button",
    kit: "Button",
    lead: "A native button with tones and sizes. Loading keeps it focusable and marks it busy."
  },
  field: {
    title: "Field & Input",
    kit: "Field",
    lead: "A text input with its label, description and error, wired by ui-kit's Field: ids, aria-describedby and aria-invalid are handled for you. Input on its own is the bare control."
  },
  checkbox: {
    title: "Checkbox",
    kit: "Checkbox",
    lead: "A button with role checkbox, including the indeterminate state. The tick is drawn from data-checked and data-indeterminate."
  },
  switch: {
    title: "Switch",
    kit: "Switch",
    lead: "An on/off control with role switch. The thumb slides by the difference between the track's width and height tokens."
  },
  "radio-group": {
    title: "Radio Group",
    kit: "RadioGroup",
    lead: "One choice from a list, with a roving tabindex: arrow keys move and pick. Vertical or horizontal."
  },
  select: {
    title: "Select",
    kit: "Select",
    lead: "A listbox in the browser's top layer, positioned under its trigger. It keeps its own open state and reports only the picked value."
  },
  slider: {
    title: "Slider",
    kit: "Slider",
    lead: "A range input with a draggable thumb. ui-kit places the indicator and thumb through CSS variables; the style only reads them."
  },
  toggle: {
    title: "Toggle",
    kit: "Toggle",
    lead: "A button that stays pressed, with aria-pressed and data-pressed, for toolbars and formatting controls."
  },
  avatar: {
    title: "Avatar",
    kit: "Avatar",
    lead: "A picture with initials until it loads. The initials and their colour come from the name; the root carries data-status so styles can follow the load."
  },
  "code-block": {
    title: "Code Block",
    kit: "CodeBlock",
    lead: "Code with a title, copy button, line numbers and line marks, after shadcn's code-block. It has no ui-kit counterpart, so the design system owns its DOM; token colours come from the Syntax tokens."
  }
}

const getComponentPage = (id: ComponentId): Page => {
  const styleFile = `packages/components/src/feature/${id}/${id}.component.style.ts`
  return {
    id,
    section: "Components",
    ...componentPages[id],
    style: styles[`../../../../../${styleFile}`] ?? "",
    styleFile
  }
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
  ...ComponentIdSchema.literals.map(getComponentPage),
  {
    id: "tokens",
    section: "Foundations",
    title: "Tokens",
    lead: "Every token in the contract, and the value each theme gives it."
  }
]

export const sources = { contract, themes: { shadcn: shadcnTheme, astryx: astryxTheme } }

export const installCommand = "pnpm add @acme/components @acme/theme-shadcn"

export const install = `// main.ts
import "@acme/theme-shadcn"

// anywhere in a view
import { Avatar } from "@acme/components/avatar"
import { Button } from "@acme/components/button"

h.div.attr("data-theme", "shadcn").attr("data-mode", "dark").children(
  Avatar(h, { name: "Ada Lovelace", src: user.photo }),
  Button(h, { tone: "primary", onPress: Msg.Saved(), children: "Save" }),
)`
