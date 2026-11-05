import type { JourneyDefinition } from '@/validation/schemas'

export type JourneyElement =
  JourneyDefinition['steps'][number]['elements'][number]
export type NavigationElementType = Extract<
  JourneyElement,
  { type: 'NAVIGATION' }
>

export type ElementRenderer<T extends JourneyElement = JourneyElement> = (
  element: T
) => React.ReactNode

export type JourneyElementRenderers = {
  [K in JourneyElement['type']]: ElementRenderer<
    Extract<JourneyElement, { type: K }>
  >
}
