import { Notification, Radio, Typography } from '@porto-stack/ui'
import { useEffect } from 'react'
import { Controller, useController, useFormContext } from 'react-hook-form'

import {
  buildVehicleViewItem,
  formatPercentage,
  formatPrice,
  formatPriceFromCents,
  PRODUCT_ANALYTICS,
  pushEvent,
  reaisToCents
} from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { RadioGroupSkeleton } from '@/components/UI/Skeletons/RadioGroupSkeleton'

import type { useInstallments } from '../../useInstallments'
import styles from './Installments.module.scss'

type InstallmentsProps = {
  isLoadingInstallments: boolean
  shouldRecalculate: boolean
  isRecalculating: boolean
  installments: Awaited<ReturnType<typeof useInstallments>>['installments']
  withInsurance: boolean
}

export function Installments({
  isLoadingInstallments,
  installments,
  withInsurance
}: InstallmentsProps) {
  const mergeFields = useJourneyStore((state) => state.mergeFields)

  const { control, setValue, getValues } = useFormContext()

  const showInstallmentsSkeleton = isLoadingInstallments
  const { field } = useController({
    name: 'numberOfInstallments',
    control
  })

  useEffect(() => {
    const { fields, parameters } = useJourneyStore.getState()

    const items =
      installments?.installments?.map?.((installment) => {
        const installmentValue = withInsurance
          ? installment.withInsurance.installmentValue
          : installment.withoutInsurance.installmentValue

        const { branchId, product } =
          PRODUCT_ANALYTICS['financing-loans-vehicle-guarantee']

        return buildVehicleViewItem({
          branchId,
          productName: product,
          fields,
          standardVehicle: parameters.standardVehicle,
          withInsurance,
          installmentValue,
          quantity: installment.numberOfInstallments
        })
      }) ?? []

    if (items.length === 0) return

    pushEvent({
      event: 'view_item',
      evAction: 'ecommerce:visualizar:produto:sucesso',
      currency: 'BRL',
      items
    })
  }, [installments, withInsurance])

  useEffect(() => {
    if (!installments?.bestNumberOfInsallments) {
      return
    }

    const current = getValues('numberOfInstallments')

    const isCurrentAvailable = installments.installments.some(
      (item) => item.numberOfInstallments === current
    )

    if (current != null && isCurrentAvailable) {
      return
    }

    setValue('numberOfInstallments', installments.bestNumberOfInsallments)
    mergeFields({
      numberOfInstallments: installments.bestNumberOfInsallments
    })
  }, [
    installments?.bestNumberOfInsallments,
    installments?.installments,
    mergeFields,
    setValue,
    getValues
  ])

  const selectedInstallmentItem = installments?.installments.find(
    (item) => item.numberOfInstallments === field.value
  )

  const selectedInstallmentInfos = selectedInstallmentItem
    ? withInsurance
      ? selectedInstallmentItem.withInsurance
      : selectedInstallmentItem.withoutInsurance
    : null

  const installmentValue = selectedInstallmentInfos?.installmentValue

  useEffect(() => {
    if (installmentValue == null) return

    const installmentValueFormatted = formatPrice(installmentValue)

    setValue('installmentValue', installmentValueFormatted, {
      shouldDirty: false
    })
    mergeFields({
      installmentValue: installmentValueFormatted,
      installmentValueAmount: installmentValue
    })
  }, [installmentValue, mergeFields, setValue])

  return (
    <div className={styles.container}>
      <Typography as="h3" weight="medium" variant="title5">
        Parcelamento
      </Typography>

      {!showInstallmentsSkeleton && (
        <div className={styles.installmentsContainer}>
          <Controller
            name="numberOfInstallments"
            render={({ field }) => (
              <Radio.Group
                variant="bordered"
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value != null ? String(field.value) : ''}>
                {installments?.installments.map((installmentItem) => {
                  const installment = withInsurance
                    ? installmentItem.withInsurance
                    : installmentItem.withoutInsurance

                  return (
                    <Radio.Item
                      key={installmentItem.numberOfInstallments}
                      title={`${installmentItem.numberOfInstallments}x de ${formatPriceFromCents(reaisToCents(installment.installmentValue))}`}
                      label={`Juros de ${formatPercentage(installment.monthlyFee)} ao mês`}
                      value={String(installmentItem.numberOfInstallments)}
                    />
                  )
                })}
              </Radio.Group>
            )}
          />

          {selectedInstallmentInfos && (
            <Notification.Root>
              <Notification.Description>
                CET é o Custo Efetivo Total (a.m.) de{' '}
                {formatPercentage(
                  selectedInstallmentInfos.monthlyTotalTffectiveCost
                )}
              </Notification.Description>
              <Notification.Description>
                CET é o Custo Efetivo Total (a.a.) de{' '}
                {formatPercentage(
                  selectedInstallmentInfos.annualTotalEffectiveCost
                )}
              </Notification.Description>
            </Notification.Root>
          )}
        </div>
      )}

      {showInstallmentsSkeleton && <RadioGroupSkeleton count={6} />}
    </div>
  )
}
