import type { JourneyDefinition } from '@/validation/schemas'

type ChecklistElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'CHECKLIST' }
>

export type ChecklistElementProps = {
  element: ChecklistElementType
}
