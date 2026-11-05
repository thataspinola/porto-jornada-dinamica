import type { JourneyDefinition } from '@/validation/schemas'

type JourneyElement = JourneyDefinition['steps'][number]['elements'][number]
type NavigationElementType = Extract<JourneyElement, { type: 'NAVIGATION' }>

export type NavigationElementProps = {
  element: NavigationElementType
}
