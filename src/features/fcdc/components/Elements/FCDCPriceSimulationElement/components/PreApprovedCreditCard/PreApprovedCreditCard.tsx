import { Typography } from '@porto-stack/ui'
import { useShallow } from 'zustand/shallow'

import {
  formatPercentageFromFactor,
  formatPriceFromCents,
  reaisToCents
} from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import styles from './PreApprovedCreditCard.module.scss'

export function PreApprovedCreditCard() {
  const { services } = useJourneyStore(
    useShallow((store) => ({
      services: store.services
    }))
  ) as {
    services: {
      eligibility?: {
        person?: {
          eligibility?: {
            preApprovedValue?: number
            minimumEntryValueFactor?: number
            maxInstallments?: number
          }
        }
      }
    }
  }

  const {
    maxInstallments,
    minimumEntryValueFactor,
    preApprovedValue = 0
  } = services.eligibility?.person?.eligibility || {}

  const preApprovedValueInCents = reaisToCents(preApprovedValue)

  const showDescription = !!maxInstallments && !!minimumEntryValueFactor

  return (
    <div className={styles.container}>
      <div>
        <Typography as="h3" weight="medium" variant="title6">
          Seu crédito pré-aprovado
        </Typography>
        <Typography as="h2" weight="bold" variant="title4">
          {formatPriceFromCents(preApprovedValueInCents)}
        </Typography>
      </div>
      {showDescription && (
        <Typography
          as="p"
          weight="regular"
          variant="caption"
          color="neutral-700">
          Sujeito à análise. Entrada mínima de{' '}
          {formatPercentageFromFactor(minimumEntryValueFactor)} do valor do
          veículo e prazo máximo de {maxInstallments} meses
        </Typography>
      )}
    </div>
  )
}
