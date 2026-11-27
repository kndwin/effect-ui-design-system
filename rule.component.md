# rule: `*.component.ts`

A `.component.ts` file **exports UI**, as one of:

- an `Html.component({...}).make({...})`: stateful, with a Model and messages, or
- a view function, `(h, options) => …` or `(element, options) => …`, that returns elements.

ast-grep: `component-exports-ui`.

## Conventions

- Styles live next to the component in a `*.component.style.ts` and are applied with
  `Style.classes(XStyle, options)`. The component file never writes CSS.
- A component exports itself (`export const Button = …`). There is no registry and no barrel.
  Packages expose it through `package.json` `exports`.
- Side effects run as `Command`s from `update`, never at import time.
- Helpers that aren't UI go in a `*.pure.ts`.
