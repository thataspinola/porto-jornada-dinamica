import type { JourneyDefinition } from '@/validation'

type REFFSimulationElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'REFF_SIMULATION' }
>

export type REFFSimulationElementProps = {
  element: REFFSimulationElementType
}
