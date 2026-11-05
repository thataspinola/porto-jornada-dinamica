import type { JourneyDefinition } from '@/validation/schemas'

type LocationBoxElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'LOCATION_BOX' }
>

export type LocationBoxElementProps = {
  element: LocationBoxElementType
}
