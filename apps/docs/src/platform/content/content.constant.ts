import contract from "../../../../../packages/components/src/platform/token/contract.token.ts?raw"
import astryxTheme from "../../../../../packages/themes/astryx/src/astryx.theme.ts?raw"
import shadcnTheme from "../../../../../packages/themes/shadcn/src/shadcn.theme.ts?raw"
import { type ComponentId, ComponentIdSchema } from "./component.schema.ts"
import type { Page } from "./content.schema.ts"

const styles = import.meta.glob<string>("../../../../../packages/components/src/*/*/*.component.style.ts", {
  eager: true,
  query: "?raw",
  import: "default"
})

const componentPages: {
  readonly [Id in ComponentId]: {
    readonly title: string
    readonly kit: string
    readonly lead: string
    readonly source?: string
  }
} = {
  button: {
    title: "Button",
    source: "platform/button/button",
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
  dialog: {
    title: "Dialog",
    kit: "Dialog",
    lead: "A modal window in the browser's top layer. It traps focus, locks scroll without shifting the page, and returns focus to its trigger when it closes."
  },
  "alert-dialog": {
    title: "Alert Dialog",
    kit: "Dialog",
    source: "feature/dialog/dialog",
    lead: "A dialog that asks before something destructive. Clicking outside does nothing; Cancel has focus first. It shares the Dialog style."
  },
  drawer: {
    title: "Drawer",
    kit: "Drawer",
    lead: "A panel that slides in from an edge and swipes away. The style follows ui-kit's swipe variables, so the drawer tracks your finger."
  },
  popover: {
    title: "Popover",
    kit: "Popover",
    lead: "Rich content anchored to a trigger, flipped and shifted to stay on screen. Not modal: the page stays usable."
  },
  tooltip: {
    title: "Tooltip",
    kit: "Tooltip",
    lead: "A short label on hover or keyboard focus, after a delay. Touch users never see it, so it never holds the only copy of anything."
  },
  menu: {
    title: "Menu",
    kit: "Menu",
    lead: "A list of actions behind a button, with arrow-key navigation and typeahead. Press, drag and release to pick in one gesture."
  },
  toast: {
    title: "Toast",
    kit: "Toast",
    lead: "Short notices in a corner stack. Mount one Toaster near the root, then send RequestedAdd to ui-kit's ToastProvider from any update inside it."
  },
  tabs: {
    title: "Tabs",
    kit: "Tabs",
    lead: "Panels behind a row of tabs. Arrow keys move between tabs; an underline slides to the active one using the variables ui-kit measures."
  },
  accordion: {
    title: "Accordion",
    kit: "Accordion",
    lead: "Stacked sections that open one at a time, or several with multiple. Panels animate their height from ui-kit's measured variable."
  },
  collapsible: {
    title: "Collapsible",
    kit: "Collapsible",
    lead: "One section that shows and hides, with the same height animation as Accordion."
  },
  separator: {
    title: "Separator",
    kit: "Separator",
    lead: "A thin rule between groups, horizontal or vertical. Decorative separators are hidden from screen readers."
  },
  "scroll-area": {
    title: "Scroll Area",
    kit: "ScrollArea",
    lead: "Native scrolling with a slim custom scrollbar that appears while you scroll or hover. The thumb is sized and placed by ui-kit."
  },
  toolbar: {
    title: "Toolbar",
    kit: "Toolbar",
    lead: "A row of controls with one tab stop: arrow keys move between them. Buttons can show a pressed state."
  },
  "navigation-menu": {
    title: "Navigation Menu",
    kit: "NavigationMenu",
    lead: "A labelled nav of links that marks the current page with aria-current. Arrow keys move between links."
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
  const styleFile = `packages/components/src/${componentPages[id].source ?? `feature/${id}/${id}`}.component.style.ts`
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
