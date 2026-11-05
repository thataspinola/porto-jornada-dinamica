import { useShallow } from 'zustand/shallow'

import { formatPercentage, formatPriceFromCents, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import type {
  FCDCResumeElementProps,
  FCDCResumeInstallment,
  FCDCResumeOption
} from './FCDCResumeElement.types'

const formatPercent = (value: number | undefined): string | undefined => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return undefined
  }

  return formatPercentage(value)
}

const formatBRL = (reais: number | undefined): string | undefined => {
  if (typeof reais !== 'number' || !Number.isFinite(reais)) {
    return undefined
  }

  return formatPriceFromCents(reaisToCents(reais))
}

type CreditcardFlag = '1000' | '2000'

const CARD_FLAG_LABELS: Record<CreditcardFlag, string> = {
  '1000': 'Visa',
  '2000': 'Mastercard'
}

const PAYMENT_METHOD_LABEL: Record<'CREDIT' | 'INVOICE', string> = {
  CREDIT: 'Cartão Porto Bank',
  INVOICE: 'Boleto'
}

export function useFCDCResumeElementController(
  element: FCDCResumeElementProps['element']
) {
  const { fields, services } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      services: state.services
    }))
  )

  const selectedInstallment =
    services?.quotation?.installments?.installments?.find(
      (installment: { numberOfInstallments: number }) =>
        installment.numberOfInstallments === fields.numberOfInstallments
    )

  const installmentInfos: FCDCResumeInstallment | undefined =
    fields.withInsurance
      ? selectedInstallment?.withInsurance
      : selectedInstallment?.withoutInsurance

  const entryCalculation = services?.['product-domains']?.['entry-calculation']

  const withInsurance = Boolean(fields.withInsurance)
  const numberOfInstallments = fields.numberOfInstallments as number | undefined
  const installmentValue = formatBRL(installmentInfos?.installmentValue)

  const preTitle =
    typeof numberOfInstallments === 'number'
      ? `${numberOfInstallments}x parcelas de`
      : undefined

  const mainInfos: FCDCResumeOption[] = [
    { label: 'Valor do veículo', value: formatBRL(fields.vehicleValue) },
    {
      label: 'Valor da entrada',
      value: formatBRL(entryCalculation?.resultingEntry)
    },
    {
      label: 'Valor financiado',
      value: formatBRL(entryCalculation?.financingValue)
    },
    {
      label: 'Forma de pagamento',
      value: `${PAYMENT_METHOD_LABEL[fields.paymentMethod as 'CREDIT' | 'INVOICE'] ?? ''}${fields.creditcardFlag ? ` ${CARD_FLAG_LABELS[fields.creditcardFlag as CreditcardFlag] ?? ''}` : ''}`,
      hasDivider: true
    },
    {
      label: 'Financiamento protegido',
      tag: {
        label: withInsurance ? 'Ativado' : 'Desativado',
        variant: withInsurance ? 'green' : 'red',
        negative: true
      }
    },
    {
      label: 'Valor da parcela',
      value:
        typeof numberOfInstallments === 'number' && installmentValue
          ? `${numberOfInstallments}x de ${installmentValue}`
          : undefined,
      hasDivider: true
    }
  ]

  const feeInfos: FCDCResumeOption[] = [
    {
      label: 'Taxa de juros A.M.',
      value: formatPercent(installmentInfos?.monthlyFee)
    },
    {
      label: 'Taxa de juros A.A.',
      value: formatPercent(installmentInfos?.annualFee)
    },
    {
      label: 'CET A.M.:',
      value: formatPercent(installmentInfos?.monthlyTotalTffectiveCost)
    },
    {
      label: 'CET A.A.:',
      value: formatPercent(installmentInfos?.annualTotalEffectiveCost)
    },
    { label: 'IOF', value: formatBRL(installmentInfos?.iof) },
    {
      label: 'Tarifa de cadastro (TC)',
      value: formatBRL(services?.quotation?.installments?.registrationFee)
    }
  ]

  const pdfOptions: FCDCResumeOption[] = [...mainInfos, ...feeInfos]

  const pdfFileName = `resumo-financiamento-${Date.now()}.pdf`

  return {
    preTitle,
    installmentValue,
    mainInfos,
    feeInfos,
    pdfOptions,
    pdfFileName,
    children: element.config.children,
    hasInstallmentInfo: Boolean(installmentInfos)
  }
}
