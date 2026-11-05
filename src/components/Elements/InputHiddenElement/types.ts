import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type InputHiddenElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'INPUT_HIDDEN' }
>

export type InputHiddenElementProps = {
  element: InputHiddenElementType
}
