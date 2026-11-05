import { IconCardCredit } from '@porto-stack/icons'
import { Notification, Radio, Typography } from '@porto-stack/ui'
import { useEffect } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'

import { useJourneyStore } from '@/store/journeyStore'

import styles from './PaymentMethod.module.scss'

type CreditcardFlag = '1000' | '2000'

type Services = {
  eligibility?: {
    person?: {
      eligibility?: {
        preApprovedValue?: number
      }
      cards?: string[]
    }
  }
}

const CARD_FLAG_LABELS: Record<CreditcardFlag, string> = {
  '1000': 'Cartão Porto Bank Visa',
  '2000': 'Cartão Porto Bank Mastercard'
}

const SUPPORTED_CARD_FLAGS: CreditcardFlag[] = ['1000', '2000']

const INVOICE_VALUE = 'INVOICE'

export function PaymentMethod() {
  const services = useJourneyStore((state) => state.services) as Services
  const mergeFields = useJourneyStore((state) => state.mergeFields)
  const { setValue, control } = useFormContext()

  const availableCards = (services?.eligibility?.person?.cards ?? []).filter(
    (card): card is CreditcardFlag =>
      SUPPORTED_CARD_FLAGS.includes(card as CreditcardFlag)
  )
  const hasPortoBankCard = availableCards.length > 0

  const paymentMethod = useWatch({ control, name: 'paymentMethod' })
  const creditcardFlag = useWatch({ control, name: 'creditcardFlag' }) as
    | CreditcardFlag
    | undefined

  const firstAvailableCard = availableCards[0]

  useEffect(() => {
    if (firstAvailableCard) {
      setValue('paymentMethod', 'CREDIT')
      setValue('creditcardFlag', firstAvailableCard)
      mergeFields({
        paymentMethod: 'CREDIT',
        creditcardFlag: firstAvailableCard
      })
      return
    }

    setValue('paymentMethod', 'INVOICE')
    setValue('creditcardFlag', undefined)
    mergeFields({ paymentMethod: 'INVOICE', creditcardFlag: undefined })
  }, [firstAvailableCard, setValue, mergeFields])

  const radioValue =
    paymentMethod === 'CREDIT' && creditcardFlag
      ? creditcardFlag
      : INVOICE_VALUE

  const handleValueChange = (value: string) => {
    if (value === INVOICE_VALUE) {
      setValue('paymentMethod', 'INVOICE')
      setValue('creditcardFlag', undefined)
      mergeFields({ paymentMethod: 'INVOICE', creditcardFlag: undefined })
      return
    }

    const flag = value as CreditcardFlag
    setValue('paymentMethod', 'CREDIT')
    setValue('creditcardFlag', flag)
    mergeFields({ paymentMethod: 'CREDIT', creditcardFlag: flag })
  }

  return (
    <div className={styles.container}>
      <Typography as="h3" weight="medium" variant="title5">
        Selecione a forma de pagamento
      </Typography>

      {hasPortoBankCard && (
        <Notification.Root variant="default">
          <Notification.Icon>
            <IconCardCredit color="seguro-900" />
          </Notification.Icon>
          <Notification.Description>
            Use seu Cartão Porto Bank para pagar suas parcelas com praticidade.
          </Notification.Description>
        </Notification.Root>
      )}

      <div>
        <Radio.Group
          variant="bordered"
          value={radioValue}
          onValueChange={handleValueChange}>
          {availableCards.map((card) => (
            <Radio.Item
              key={card}
              title={CARD_FLAG_LABELS[card]}
              label="Pague na fatura do cartão"
              value={card}
            />
          ))}

          <Radio.Item
            title="Boleto Bancário"
            label="Receba o boleto por e-mail e pague até o vencimento"
            value={INVOICE_VALUE}
          />
        </Radio.Group>
      </div>
    </div>
  )
}
