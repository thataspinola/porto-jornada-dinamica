import type { JourneyDefinition } from '@/validation/schemas'

type TitleElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'TITLE' }
>

export type TitleElementProps = {
  element: TitleElementType
}
