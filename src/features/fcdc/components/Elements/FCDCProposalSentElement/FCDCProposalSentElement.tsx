'use client'
import { IconCar, IconCircleCheck } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'
import { useShallow } from 'zustand/shallow'

import { formatPriceFromCents, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import s from './FCDCProposalSentElement.module.scss'

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

type FCDCResumeInstallment = {
  annualFee?: number
  annualTotalEffectiveCost?: number
  installmentValue?: number
  insurance?: number
  iof?: number
  monthlyFee?: number
  monthlyFeeNet?: number
  monthlyTotalTffectiveCost?: number
}

import type { FCDCProposalSentElementProps } from './FCDCProposalSentElement.types'

export const FCDCProposalSentElement = ({
  element: _element
}: FCDCProposalSentElementProps) => {
  const { fields, services } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      services: state.services
    }))
  )

  const protocolNumber = services?.proposal?.proposal?.protocolNumber

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

  const installmentValue = formatBRL(installmentInfos?.installmentValue)
  const vehicleValue = formatBRL(fields.vehicleValue)
  const entryValue = formatBRL(entryCalculation?.resultingEntry)
  const financingValue = formatBRL(entryCalculation?.financingValue)

  return (
    <div className={s.container}>
      <div className={s.vehicleDataContainer}>
        <div className={s.vehicleDataContainerTitle}>
          <IconCar size={32} />
          <Typography as="h2" variant="body1" weight="bold">
            Financiamento de veículo
          </Typography>
        </div>
        <div className={s.vehicleDataContainerMessage}>
          <IconCircleCheck size={24} color="success-900" />
          <Typography
            as="p"
            variant="body1"
            weight="regular"
            color="success-900">
            Solicitação de crédito enviada
          </Typography>
        </div>
        {fields.vehicleModel && (
          <div className={s.vehicleData}>
            {!!fields.vehicleBrand && (
              <Typography as="h3" variant="title6" weight="bold">
                {fields.vehicleBrand}
              </Typography>
            )}

            <Typography as="p" variant="body2" color="neutral-800">
              {!!fields.vehiclePlate && (
                <Typography variant="body2" weight="bold">
                  {fields.vehiclePlate} |{' '}
                </Typography>
              )}
              {fields.vehicleModel}
            </Typography>

            {fields.vehicleManufacturingYear && fields.vehicleModelYear && (
              <Typography as="p" variant="body2" color="neutral-800">
                {fields.vehicleManufacturingYear}/{fields.vehicleModelYear}
              </Typography>
            )}
          </div>
        )}

        <Typography as="p" variant="body1" color="neutral-800">
          O valor solicitado está pré-aprovado e sua proposta está em análise.
          Dando tudo certo, enviaremos uma resposta por e-mail em até 48 horas.
        </Typography>

        <Typography as="p" variant="body1" color="neutral-800">
          Caso necessário, entraremos em contato por telefone ou e-mail para
          mais informações.
        </Typography>
      </div>

      <div className={s.summaryContainer}>
        <div className={s.summary}>
          <div className={s.summaryTitle}>
            <Typography as="h2" variant="title6" weight="semibold">
              Resumo do financiamento
            </Typography>

            {!!protocolNumber && (
              <Typography as="p" variant="body1" weight="regular">
                Proposta n° {protocolNumber}
              </Typography>
            )}
          </div>

          {!!fields.paymentMethod && (
            <Typography as="p" variant="body1" className={s.resumeItem}>
              Forma de pagamento{' '}
              <b>
                {PAYMENT_METHOD_LABEL[fields.paymentMethod] ?? ''}
                {fields.creditcardFlag && (
                  <> {CARD_FLAG_LABELS[fields.creditcardFlag] ?? ''}</>
                )}
              </b>
            </Typography>
          )}

          {!!fields.numberOfInstallments && !!installmentValue && (
            <Typography as="p" variant="body1" className={s.resumeItem}>
              Parcelado em{' '}
              <b>
                {fields.numberOfInstallments}x {installmentValue}
              </b>
            </Typography>
          )}

          {!!entryValue && (
            <Typography as="p" variant="body1" className={s.resumeItem}>
              Entrada <b>{entryValue}</b>
            </Typography>
          )}

          {!!vehicleValue && (
            <Typography as="p" variant="body1" className={s.resumeItem}>
              Valor do veículo <b>{vehicleValue}</b>
            </Typography>
          )}
        </div>

        {!!financingValue && (
          <Typography
            as="h4"
            variant="title6"
            weight="bold"
            className={s.totalValueContainer}>
            Total financiado <b>{financingValue}</b>
          </Typography>
        )}
      </div>
    </div>
  )
}
