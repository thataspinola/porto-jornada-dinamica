import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type REFFResumeElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'REFF_RESUME' }
>

export type REFFResumeElementProps = {
  element: REFFResumeElementType
}

export type REFFResumeInstallment = {
  annualFee?: number
  annualTotalEffectiveCost?: number
  installmentValue?: number
  insurance?: number
  iof?: number
  monthlyFee?: number
  monthlyFeeNet?: number
  monthlyTotalTffectiveCost?: number
}

export type REFFResumeOptionTagVariant = 'green' | 'red'

export type REFFResumeOption = {
  label: string
  value?: string
  values?: string[]
  isSection?: boolean
  tag?: {
    label: string
    variant?: REFFResumeOptionTagVariant
    negative?: boolean
  }
  hasDivider?: boolean
}
