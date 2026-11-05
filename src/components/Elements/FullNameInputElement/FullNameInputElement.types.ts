import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type FullNameInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FULL_NAME_INPUT' }
>

export type FullNameInputElementProps = {
  element: FullNameInputElementType
}
