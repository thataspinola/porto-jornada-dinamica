import type { JourneyDefinition } from '@/validation/schemas'

export type FormValues = Record<string, unknown>

type CepInputElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CEP_INPUT' }
>

export type CepInputElementProps = {
  element: CepInputElementType
}
