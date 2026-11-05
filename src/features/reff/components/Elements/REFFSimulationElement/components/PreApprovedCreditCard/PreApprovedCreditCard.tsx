import { Typography } from '@porto-stack/ui'

import { formatPriceFromCents, reaisToCents } from '@/utils'

import styles from './PreApprovedCreditCard.module.scss'

type PreApprovedCreditCardProps = {
  availableCredit: number
}

export function PreApprovedCreditCard({
  availableCredit
}: PreApprovedCreditCardProps) {
  const preApprovedValueInCents = reaisToCents(availableCredit)

  return (
    <div className={styles.container}>
      <div>
        <Typography as="h3" weight="medium" variant="title6">
          Seu limite pré-aprovado
        </Typography>
        <Typography as="h2" weight="bold" variant="title4">
          {formatPriceFromCents(preApprovedValueInCents)}
        </Typography>
      </div>
      <Typography as="p" weight="regular" variant="caption" color="neutral-700">
        O dinheiro cai na conta em até 48h após a análise do seu perfil.
      </Typography>
    </div>
  )
}
