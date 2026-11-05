import type { JourneyDefinition } from '@/validation/schemas'

type BirthDateInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'BIRTH_DATE_INPUT' }
>

export type BirthDateInputElementProps = {
  element: BirthDateInputElementType
}
