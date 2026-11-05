import type { JourneyDefinition } from '@/validation/schemas'

type SummaryPanelElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'SUMMARY_PANEL' }
>

export type SummaryPanelElementProps = {
  element: SummaryPanelElementType
}
