import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type TextInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'TEXT_INPUT' }
>

export type TextInputElementProps = {
  element: TextInputElementType
}
