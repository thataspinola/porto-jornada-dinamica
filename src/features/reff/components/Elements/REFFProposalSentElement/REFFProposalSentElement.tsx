'use client'
import { IconCircleCheck, IconSmartphone } from '@porto-stack/icons'
import { Typography } from '@porto-stack/ui'
import { useShallow } from 'zustand/shallow'

import { formatPriceFromCents, reaisToCents, redirectTo } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { Button } from '@/components/UI'

import { REFF_BANK_LABELS } from '@/features/reff/constants'

import s from './REFFProposalSentElement.module.scss'
import type { REFFProposalSentElementProps } from './REFFProposalSentElement.types'

const linkAppStore =
  'https://apps.apple.com/us/app/porto-conta-digital-e-seguros/id1511026277'
const linkPlayStore =
  'https://play.google.com/store/apps/details?id=br.com.portoseguro.experienciacliente.mundoporto'

const formatBRL = (reais: number | undefined): string | undefined => {
  if (typeof reais !== 'number' || !Number.isFinite(reais)) {
    return undefined
  }

  return formatPriceFromCents(reaisToCents(reais))
}

type REFFResumeInstallment = {
  annualFee?: number
  annualTotalEffectiveCost?: number
  installmentValue?: number
  insurance?: number
  iof?: number
  monthlyFee?: number
  monthlyFeeNet?: number
  monthlyTotalTffectiveCost?: number
}

function downloadApp() {
  const win = window as Window & { MSStream?: unknown; opera?: string }
  const userAgent = navigator.userAgent || navigator.vendor || win.opera

  if (/iPad|iPhone|iPod/.test(userAgent) && !win.MSStream) {
    window.location.href = linkAppStore
    return
  }

  if (/android/i.test(userAgent)) {
    window.location.href = linkPlayStore
    return
  }

  window.location.href = linkPlayStore
}

export function REFFProposalSentElement({
  element: _element
}: REFFProposalSentElementProps) {
  const { fields, services } = useJourneyStore(
    useShallow((state) => ({
      fields: state.fields,
      services: state.services
    }))
  )

  const protocolNumber = services?.proposal?.proposal?.protocolNumber
  const numberOfInstallments = fields.numberOfInstallments

  const selectedInstallment =
    services?.quotation?.installments?.installments?.find(
      (installment: { numberOfInstallments: number }) =>
        installment.numberOfInstallments === numberOfInstallments
    )

  const installmentInfos: REFFResumeInstallment | undefined =
    fields.withInsurance
      ? selectedInstallment?.withInsurance
      : selectedInstallment?.withoutInsurance

  const installmentValue = formatBRL(installmentInfos?.installmentValue)
  const creditValue = formatBRL(fields.requestedValue)

  const bankLabel = fields.bankCode
    ? (REFF_BANK_LABELS[fields.bankCode] ?? fields.bankCode)
    : undefined
  const agency = fields.bankBranchNumber
  const account = fields.bankAccountNumber
  const accountDigit = fields.bankAccountVerifyDigit
  const formattedAccount =
    account && accountDigit ? `${account}-${accountDigit}` : account
  const hasCreditAccount = Boolean(bankLabel || agency || formattedAccount)

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.checkIcon}>
          <IconCircleCheck size={42} />
        </span>
        <Typography as="h1" weight="bold" variant="title3" className={s.title}>
          Proposta enviada!
        </Typography>
        <Typography as="p" variant="title5" className={s.subtitle}>
          A solicitação já está com a nossa equipe. Entraremos em contato por
          e-mail ou telefone em até 48 horas.
        </Typography>
      </div>

      <div className={s.banner}>
        <IconSmartphone size={32} />
        <div className={s.bannerContent}>
          <Typography as="p" variant="body1" weight="bold">
            Baixe o App Porto
          </Typography>
          <Typography as="p" variant="body2" className={s.bannerSubtitle}>
            Gerencie seu empréstimo Porto Bank em um só lugar.
          </Typography>
          <button type="button" className={s.downloadCta} onClick={downloadApp}>
            <Typography as="span" variant="body2" weight="bold">
              Baixar agora
            </Typography>
          </button>
        </div>
      </div>

      <div className={s.summary}>
        <div className={s.summaryHeader}>
          <Typography as="h2" variant="title6" weight="bold">
            Resumo da proposta
          </Typography>
          {!!protocolNumber && (
            <Typography as="p" variant="body1" className={s.protocolNumber}>
              Número {protocolNumber}
            </Typography>
          )}
        </div>

        {!!creditValue && (
          <div className={s.summaryRow}>
            <Typography as="p" variant="body1">
              Valor do crédito
            </Typography>
            <Typography
              as="p"
              variant="body1"
              weight="bold"
              className={s.summaryValue}>
              {creditValue}
            </Typography>
          </div>
        )}

        {!!numberOfInstallments && !!installmentValue && (
          <div className={s.summaryRow}>
            <Typography as="p" variant="body1">
              Parcelas
            </Typography>
            <Typography
              as="p"
              variant="body1"
              weight="bold"
              className={s.summaryValue}>
              {numberOfInstallments}x de {installmentValue}
            </Typography>
          </div>
        )}

        {hasCreditAccount && (
          <div className={`${s.summaryRow} ${s.summaryRowMultiline}`}>
            <Typography as="p" variant="body1">
              Conta para crédito
            </Typography>
            <div className={s.summaryAccount}>
              {!!bankLabel && (
                <Typography
                  as="p"
                  variant="body1"
                  weight="bold"
                  className={s.summaryValue}>
                  Conta {bankLabel}
                </Typography>
              )}
              {!!agency && (
                <Typography
                  as="p"
                  variant="body1"
                  weight="bold"
                  className={s.summaryValue}>
                  Agência {agency}
                </Typography>
              )}
              {!!formattedAccount && (
                <Typography
                  as="p"
                  variant="body1"
                  weight="bold"
                  className={s.summaryValue}>
                  Conta {formattedAccount}
                </Typography>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={s.actions}>
        <Button
          type="button"
          fluid
          onClick={() =>
            redirectTo(
              'https://www.portoseguro.com.br/emprestimos-e-financiamento'
            )
          }>
          Conheça outros produtos
        </Button>
        <Button
          type="button"
          fluid
          styles="ghost"
          className={s.closeButton}
          onClick={() => redirectTo('https://www.portoseguro.com.br/')}>
          Fechar
        </Button>
      </div>
    </div>
  )
}
