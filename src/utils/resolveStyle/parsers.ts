export type StylePropertyParser = (value: unknown) => unknown

export const spacingParser: StylePropertyParser = (value) =>
  `var(--ui-spacing-${value})`

export const colorParser: StylePropertyParser = (value) =>
  `var(--ui-colors-${value})`
