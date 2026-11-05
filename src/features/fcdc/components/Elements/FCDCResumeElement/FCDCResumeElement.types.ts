import type { JourneyDefinition } from '@/validation/schemas/journey.schema'

type FCDCResumeElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FCDC_RESUME' }
>

export type FCDCResumeElementProps = {
  element: FCDCResumeElementType
}

export type FCDCResumeInstallment = {
  annualFee?: number
  annualTotalEffectiveCost?: number
  installmentValue?: number
  insurance?: number
  iof?: number
  monthlyFee?: number
  monthlyFeeNet?: number
  monthlyTotalTffectiveCost?: number
}

export type FCDCResumeOptionTagVariant = 'green' | 'red'

export type FCDCResumeOption = {
  label: string
  value?: string
  tag?: {
    label: string
    variant?: FCDCResumeOptionTagVariant
    negative?: boolean
  }
  hasDivider?: boolean
}
