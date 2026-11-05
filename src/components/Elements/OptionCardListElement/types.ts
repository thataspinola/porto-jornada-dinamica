import type { JourneyDefinition } from '@/validation/schemas'

type OptionCardListElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'OPTION_CARD_LIST' }
>

export type OptionCardListElementProps = {
  element: OptionCardListElementType
}
