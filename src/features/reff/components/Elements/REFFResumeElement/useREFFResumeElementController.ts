import { useShallow } from 'zustand/shallow'

import {
  cpfMask,
  formatPercentage,
  formatPriceFromCents,
  maskLicensePlate,
  phoneMask,
  reaisToCents
} from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { REFF_BANK_LABELS } from '@/features/reff/constants'

import type {
  REFFResumeElementProps,
  REFFResumeInstallment,
  REFFResumeOption
} from './REFFResumeElement.types'

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

const formatBankValue = (bank: unknown): string | undefined => {
  if (!bank) return undefined

  const bankName = REFF_BANK_LABELS[String(bank)] ?? String(bank)

  return bankName.toLowerCase().startsWith('banco')
    ? bankName
    : `Banco ${bankName}`
}

export function useREFFResumeElementController(
  element: REFFResumeElementProps['element']
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

  const installmentInfos: REFFResumeInstallment | undefined =
    fields.withInsurance
      ? selectedInstallment?.withInsurance
      : selectedInstallment?.withoutInsurance

  const numberOfInstallments = fields.numberOfInstallments as number | undefined
  const installmentValue = formatBRL(installmentInfos?.installmentValue)
  const insuranceMonthly = selectedInstallment?.withInsurance?.insurance
  const insuranceTotal = services?.quotation?.installments?.insuranceAmount

  const monthlyFee = formatPercent(installmentInfos?.monthlyFee)
  const annualFee = formatPercent(installmentInfos?.annualFee)
  const monthlyCet = formatPercent(installmentInfos?.monthlyTotalTffectiveCost)
  const annualCet = formatPercent(installmentInfos?.annualTotalEffectiveCost)

  const vehicleLabel = [fields.vehicleBrand, fields.vehicleModel]
    .filter(Boolean)
    .join(' ')

  const accountValue =
    fields.bankAccountNumber && fields.bankAccountVerifyDigit
      ? `${fields.bankAccountNumber}-${fields.bankAccountVerifyDigit}`
      : fields.bankAccountNumber
        ? String(fields.bankAccountNumber)
        : undefined

  const creditAccountValues = [
    formatBankValue(fields.bankCode),
    fields.bankBranchNumber ? `Agência ${fields.bankBranchNumber}` : undefined,
    accountValue ? `Conta ${accountValue}` : undefined
  ].filter((value): value is string => Boolean(value))

  const options: REFFResumeOption[] = [
    {
      label: 'Valor solicitado',
      value: formatBRL(fields.requestedValue),
      hasDivider: true
    },
    {
      label: 'Parcelas',
      value:
        typeof numberOfInstallments === 'number' && installmentValue
          ? `${numberOfInstallments}x de ${installmentValue}`
          : undefined,
      hasDivider: true
    },
    {
      label: 'Taxa de juros',
      values: [
        monthlyFee ? `${monthlyFee} ao mês` : undefined,
        annualFee ? `${annualFee} ao ano` : undefined
      ].filter((value): value is string => Boolean(value)),
      hasDivider: true
    },
    {
      label: 'IOF',
      value: formatBRL(installmentInfos?.iof),
      hasDivider: true
    },
    {
      label: 'Custo Efetivo Total - CET',
      values: [
        monthlyCet ? `${monthlyCet} ao mês` : undefined,
        annualCet ? `${annualCet} ao ano` : undefined
      ].filter((value): value is string => Boolean(value)),
      hasDivider: true
    },
    ...(creditAccountValues.length > 0
      ? [
          {
            label: 'Conta para crédito',
            values: creditAccountValues,
            hasDivider: true
          }
        ]
      : []),
    {
      label: 'Forma de pagamento',
      value: `${PAYMENT_METHOD_LABEL[fields.paymentMethod as 'CREDIT' | 'INVOICE'] ?? ''}${fields.creditcardFlag ? ` ${CARD_FLAG_LABELS[fields.creditcardFlag as CreditcardFlag] ?? ''}` : ''}`,
      hasDivider: true
    },
    {
      label: 'Taxa de cadastro',
      value: formatBRL(services?.quotation?.installments?.registrationFee),
      hasDivider: true
    },
    ...(fields.withInsurance
      ? [
          {
            label: 'Seguro protegido',
            isSection: true
          },
          {
            label: 'Valor mensal',
            value: formatBRL(insuranceMonthly),
            hasDivider: true
          },
          {
            label: 'Valor total',
            value: formatBRL(insuranceTotal),
            hasDivider: true
          }
        ]
      : []),
    {
      label: 'Dados pessoais',
      isSection: true
    },
    {
      label: 'CPF',
      value: fields.taxvat ? cpfMask(String(fields.taxvat)) : undefined,
      hasDivider: true
    },
    {
      label: 'E-mail',
      value: fields.email ? String(fields.email) : undefined,
      hasDivider: true
    },
    {
      label: 'Telefone',
      value: fields.phone ? phoneMask(String(fields.phone)) : undefined,
      hasDivider: true
    },
    {
      label: 'Dados do veículo',
      isSection: true
    },
    {
      label: 'Veículo',
      value: vehicleLabel || undefined,
      hasDivider: true
    },
    {
      label: 'Placa',
      value: fields.vehiclePlate
        ? maskLicensePlate(String(fields.vehiclePlate))
        : undefined
    }
  ]

  return {
    options,
    children: element.config.children,
    hasInstallmentInfo: Boolean(installmentInfos)
  }
}
