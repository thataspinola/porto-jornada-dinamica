import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type EmailInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'EMAIL_INPUT' }
>

export type TextInputElementProps = {
  element: EmailInputElementType
}
