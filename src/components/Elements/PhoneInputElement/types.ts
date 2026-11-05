import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type PhoneInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PHONE_INPUT' }
>

export type PhoneInputElementProps = {
  element: PhoneInputElementType
}
