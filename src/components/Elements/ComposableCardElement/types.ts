import type { JourneyDefinition } from '@/validation/schemas'

type ComposableCardElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'COMPOSABLE_CARD' }
>

export type ComposableCardElementProps = {
  element: ComposableCardElementType
}

export type ComposableCardChild =
  ComposableCardElementType['config']['children'][number]

export type ComposableCardChildElement = ComposableCardChild['element']
