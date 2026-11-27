import * as Kit from "@weft/design-system/Kit"

const AvatarDescriptor = Kit.make({
  name: "Avatar",
  parts: {
    root: {
      states: { loading: "[data-status=loading]", loaded: "[data-status=loaded]", error: "[data-status=error]" }
    },
    image: { states: {} },
    fallback: { states: {} }
  },
  vars: {},
  pseudo: []
})
export interface AvatarParts extends Kit.Type<typeof AvatarDescriptor> {}
export const AvatarParts: AvatarParts = AvatarDescriptor
