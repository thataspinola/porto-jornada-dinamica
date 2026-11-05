import type { JourneyDefinition } from '@/validation'

export type FormValues = Record<string, unknown>

type CepElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CEP' }
>

export type CepElementProps = {
  element: CepElementType
}
