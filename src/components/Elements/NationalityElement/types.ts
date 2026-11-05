import type { JourneyDefinition } from '@/validation/schemas'

type NationalityElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'NATIONALITY' }
>

export type NationalityElementProps = {
  element: NationalityElementType
}
