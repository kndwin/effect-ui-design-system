import contract from "../../../../../packages/components/src/platform/token/contract.token.ts?raw"
import astryxTheme from "../../../../../packages/themes/astryx/src/astryx.theme.ts?raw"
import shadcnTheme from "../../../../../packages/themes/shadcn/src/shadcn.theme.ts?raw"
import { Array, Order } from "effect"
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
  "number-field": {
    title: "Number Field",
    kit: "NumberField",
    lead: "A number input with stepper buttons, arrow-key and wheel steps, and a scrubbable label. It formats with Intl and submits the raw number."
  },
  "otp-field": {
    title: "OTP Field",
    kit: "OTPField",
    lead: "One-time code slots. The value is Redacted, paste fills every slot, and Completed fires once the last slot is filled."
  },
  fieldset: {
    title: "Fieldset",
    kit: "Fieldset",
    lead: "A native fieldset named by its legend. Disabling it disables every Field inside."
  },
  form: {
    title: "Form",
    kit: "Form",
    lead: "A form that hands you its entries on submit and moves focus to the first invalid field. Validation stays yours."
  },
  "checkbox-group": {
    title: "Checkbox Group",
    kit: "CheckboxGroup",
    source: "feature/checkbox/checkbox-group",
    lead: "Checkboxes that share one value array, with an optional parent that shows mixed and ticks every member."
  },
  "toggle-group": {
    title: "Toggle Group",
    kit: "ToggleGroup",
    source: "feature/toggle/toggle-group",
    lead: "Toggles with one tab stop and arrow-key focus. Single or multiple selection, horizontal or vertical. Items reuse the Toggle style."
  },
  progress: {
    title: "Progress",
    kit: "Progress",
    lead: "How far a task has got. Pass null for indeterminate; the indicator width comes from the value."
  },
  meter: {
    title: "Meter",
    kit: "Meter",
    source: "feature/progress/progress",
    lead: "A measurement within a known range, like storage used. It shares the Progress style."
  },
  "preview-card": {
    title: "Preview Card",
    kit: "PreviewCard",
    lead: "A card that opens on hovering or focusing a link, after a delay. The link keeps working and no focus is trapped."
  },
  combobox: {
    title: "Combobox",
    kit: "Combobox",
    lead: "A text input that filters a list and picks one value. Typing narrows the options; the clear button and the trigger sit inside the input."
  },
  autocomplete: {
    title: "Autocomplete",
    kit: "Autocomplete",
    source: "feature/combobox/combobox",
    lead: "Free text with suggestions. The value is whatever is typed; picking a suggestion fills it in. It shares the Combobox style."
  },
  "date-field": {
    title: "Date Field",
    kit: "DateField",
    source: "feature/date/date-field",
    lead: "A typed date input that reads and writes the locale's pattern, and commits a DateTime on blur or Enter."
  },
  "date-picker": {
    title: "Date Picker",
    kit: "DatePicker",
    source: "feature/date/date-field",
    lead: "A Date Field with a calendar popup. The input stays typeable; the popup's days reuse the Calendar style."
  },
  calendar: {
    title: "Calendar",
    kit: "Calendar",
    source: "feature/date/calendar",
    lead: "A month grid for picking one day, with arrow-key movement, today marked, and localized weekday names."
  },
  "range-calendar": {
    title: "Range Calendar",
    kit: "RangeCalendar",
    source: "feature/date/calendar",
    lead: "Pick a start and an end. Days in between get data-in-range; the ends are filled. It shares the Calendar style."
  },
  "file-drop": {
    title: "File Drop",
    kit: "FileDrop",
    lead: "A drop zone with a real button for keyboard users. It filters by accept and multiple, and marks the zone while files are dragged over."
  },
  "context-menu": {
    title: "Context Menu",
    kit: "ContextMenu",
    source: "feature/menu/context-menu",
    lead: "A menu that opens at the pointer on right-click or long-press. Items reuse the Menu style."
  },
  menubar: {
    title: "Menubar",
    kit: "Menubar",
    source: "feature/menu/menubar",
    lead: "A row of menus. Arrow keys move between them, and once one is open, hovering another opens it instead."
  },
  "sortable-list": {
    title: "Sortable List",
    kit: "SortableList",
    lead: "Reorder rows by dragging the handle or with the keyboard: Space picks up, arrows move, Space drops. Each step is announced."
  },
  "virtual-list": {
    title: "Virtual List",
    kit: "VirtualList",
    lead: "Only the rows in view are in the DOM. A thousand rows scroll like ten."
  },
  center: {
    title: "Center",
    kit: "Center",
    source: "feature/layout/center",
    lead: "Centres its children on both axes, with an optional max width. One line: Element.make(CenterStyle)."
  },
  grid: {
    title: "Grid",
    kit: "Grid",
    source: "feature/layout/grid",
    lead: "A CSS grid with a fixed column count and token gaps. GridSpan lets a child span columns, and stack collapses to one column on narrow screens."
  },
  layout: {
    title: "Layout",
    kit: "Layout",
    source: "feature/layout/layout",
    lead: "The app shell: a header, start and end panels, content and a footer. These docs are built with it."
  },
  section: {
    title: "Section",
    kit: "Section",
    source: "feature/layout/section",
    lead: "A surface with padding, gap and an optional divider: base, card or muted. Cards, frames and panels in these docs are Sections."
  },
  stack: {
    title: "Stack",
    kit: "Stack",
    source: "feature/layout/stack",
    lead: "A flex row or column with token gaps, alignment and wrapping. HStack and VStack are the two directions; StackItem grows or shrinks a child."
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
    id: "get-started",
    section: "Getting started",
    title: "Get started",
    lead: "From an empty folder to a themed Weft app: get the workspace, add an app, compile styles with Vite, pick a theme and render your first components."
  },
  {
    id: "theming",
    section: "Getting started",
    title: "Theming",
    lead: "A theme is a package that fills in every token of the contract, with optional modes layered on top. It is checked by the compiler, and bad values fail the build."
  },
  ...Array.sort(
    ComponentIdSchema.literals.map(getComponentPage),
    Order.mapInput(Order.String, (page: Page) => page.title)
  ),
  {
    id: "checkout",
    section: "Templates",
    title: "Checkout",
    lead: "A sectioned checkout form beside a live order summary: Fieldsets, Field, Select, Radio Group and Number Field. Change a quantity or the shipping method and the total follows."
  },
  {
    id: "dashboard",
    section: "Templates",
    title: "Dashboard",
    lead: "Stat tiles, goal meters, a tabbed activity feed and a range picker: the shape of most analytics overviews."
  },
  {
    id: "file-explorer",
    section: "Templates",
    title: "File explorer",
    lead: "Drill through folders column by column, climb back with the breadcrumbs, and see a file's details beside the columns."
  },
  {
    id: "wizard",
    section: "Templates",
    title: "Form wizard",
    lead: "A linear stepper with a progress track: each step validates before Next, Back keeps what you typed, and a review step confirms it all."
  },
  {
    id: "inbox",
    section: "Templates",
    title: "Inbox",
    lead: "A searchable message list with an unread filter beside a reading pane: open a message to mark it read, archive it, or reply."
  },
  {
    id: "kanban",
    section: "Templates",
    title: "Kanban board",
    lead: "Lanes of Sortable Lists. Drag a card's handle or use the keyboard to reorder it, and its Move menu to send it to another lane."
  },
  {
    id: "login",
    section: "Templates",
    title: "Login",
    lead: "A centred sign-in card with validation on submit, a remember-me checkbox and provider buttons."
  },
  {
    id: "product-gallery",
    section: "Templates",
    title: "Product gallery",
    lead: "A grid of product cards with search, category filters and sorting, an add-to-cart count, and an empty state when nothing matches."
  },
  {
    id: "settings",
    section: "Templates",
    title: "Settings",
    lead: "Account settings split into tabs: a profile form, notification switches and appearance choices, with a save toast."
  },
  {
    id: "settings-dialog",
    section: "Templates",
    title: "Settings dialog",
    lead: "Preferences in a wide modal: a searchable section list beside the chosen section's switches and fields, saved or cancelled from the footer."
  },
  {
    id: "tokens",
    section: "Foundations",
    title: "Tokens",
    lead: "Every token in the contract. Components only use the names; the theme you pick applies the values."
  }
]

export const sources = { contract, themes: { shadcn: shadcnTheme, astryx: astryxTheme } }
