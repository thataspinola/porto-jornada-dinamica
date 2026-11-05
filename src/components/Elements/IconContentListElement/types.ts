import type { JourneyDefinition } from '@/validation/schemas'

type IconContentListElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'ICON_CONTENT_LIST' }
>

export type IconContentListElementProps = {
  element: IconContentListElementType
}
