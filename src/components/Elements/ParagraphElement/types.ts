import type { JourneyDefinition } from '@/validation/schemas'

type ParagraphElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'PARAGRAPH' }
>

export type ParagraphElementProps = {
  element: ParagraphElementType
}
