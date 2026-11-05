import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type ResumeElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'RESUME' }
>

export type ResumeElementProps = {
  element: ResumeElementType
}

export type ResumeOptionTagRules = NonNullable<
  NonNullable<ResumeElementType['config']['options']>[number]['tag']
>

export type ResumeOptionTagVariant = NonNullable<
  ResumeOptionTagRules[number]['variant']
>

export type ResumeDisplayOption = {
  label: string
  value?: string
  tag?: ResumeOptionTagRules
  hasDivider?: boolean
}

export type ResolvedResumeOption = {
  label: string
  value?: string
  tag?: {
    label: string
    variant?: ResumeOptionTagVariant
    negative?: boolean
  }
  hasDivider?: boolean
}
