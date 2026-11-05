'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { centsToReais, formatPrice, reaisToCents } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'
import { useNavigationStore } from '@/store/navigationStore'

import { Installments } from './components/Installments'
import { LoanRecalculationButton } from './components/LoanRecalculationButton'
import { PaymentMethod } from './components/PaymentMethod'
import { PreApprovedCreditCard } from './components/PreApprovedCreditCard'
import { ProtectedFinancing } from './components/ProtectedFinancing'
import {
  normalizeRequestedValue,
  RequestedValueInput
} from './components/RequestedValueInput'
import styles from './REFFSimulationElement.module.scss'
import type { REFFSimulationElementProps } from './REFFSimulationElement.types'
import { useInstallments } from './useInstallments'
import { useREFFSimulationErrorHandler } from './useREFFSimulationErrorHandler'

type Services = {
  eligibility?: {
    vehicle?: {
      fipeValue?: number
      availableCredit?: number
    }
  }
}

const toReais = (value: unknown): number => {
  return typeof value === 'number' && value > 0 ? value : 0
}

export const REFFSimulationElement = ({
  element: _element
}: REFFSimulationElementProps) => {
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isEditingRequestedValue, setIsEditingRequestedValue] = useState(false)

  const fields = useJourneyStore((state) => state.fields)
  const mergeFields = useJourneyStore((state) => state.mergeFields)
  const services = useJourneyStore((state) => state.services) as Services

  const { fipeValue = 0 } = services.eligibility?.vehicle || {}
  const availableCredit = toReais(
    services.eligibility?.vehicle?.availableCredit
  )

  const { hideNavigation, showNavigation } = useNavigationStore(
    useShallow((store) => ({
      hideNavigation: store.hideNavigation,
      showNavigation: store.showNavigation
    }))
  )
  const { setValue, getValues, watch, trigger, reset, formState } =
    useFormContext()

  const paymentMethod = watch('paymentMethod') as 'CREDIT' | 'INVOICE'
  const withInsurance = watch('withInsurance') as boolean
  const requestedValue = watch('requestedValue') as number | undefined

  const requestedValueInReais = toReais(
    getValues('requestedValue') ?? fields.requestedValue ?? availableCredit
  )

  const [committedRequestedValue, setCommittedRequestedValue] = useState(
    requestedValueInReais
  )

  const [recalcNonce, setRecalcNonce] = useState(0)

  const installmentsVehicleValue = fipeValue
  const installmentsEntryValue =
    committedRequestedValue > 0
      ? centsToReais(
          reaisToCents(fipeValue) - reaisToCents(committedRequestedValue)
        )
      : undefined

  const {
    installments,
    isLoadingInstallments,
    isErrorInstallments,
    errorInstallments
  } = useInstallments({
    entryValue: installmentsEntryValue,
    paymentMethod,
    vehicleValue: installmentsVehicleValue,
    nonce: recalcNonce
  })

  useREFFSimulationErrorHandler({
    errorInstallments
  })

  const handleRecalculate = useCallback(async () => {
    const isValid = await trigger(['requestedValue'])

    if (!isValid) return

    setIsRecalculating(true)

    try {
      const values = getValues()
      const normalizedValue = normalizeRequestedValue(
        values.requestedValue,
        availableCredit
      )
      const requestedValueFormatted = formatPrice(normalizedValue)

      setCommittedRequestedValue(normalizedValue)
      setRecalcNonce((n) => n + 1)

      reset({
        ...values,
        requestedValue: normalizedValue,
        requestedValueFormatted
      })
      mergeFields({
        requestedValue: normalizedValue,
        requestedValueFormatted
      })
    } finally {
      setIsRecalculating(false)
    }
  }, [trigger, getValues, reset, availableCredit, mergeFields])

  const isSimulating = isLoadingInstallments || isRecalculating
  const hasError = isErrorInstallments
  const hasDirtyValues = !!formState.dirtyFields?.requestedValue
  const shouldRecalculate = hasDirtyValues || hasError

  useEffect(() => {
    if (shouldRecalculate || isSimulating || hasError) {
      hideNavigation()
    } else {
      showNavigation()
    }

    return () => showNavigation()
  }, [
    shouldRecalculate,
    isSimulating,
    hasError,
    hideNavigation,
    showNavigation
  ])

  useEffect(() => {
    if (!availableCredit || hasDirtyValues) {
      return
    }

    const normalizedValue = normalizeRequestedValue(
      requestedValue,
      availableCredit
    )
    const requestedValueFormatted = formatPrice(normalizedValue)

    mergeFields({
      requestedValue: normalizedValue,
      requestedValueFormatted
    })

    if (normalizedValue !== requestedValue) {
      setValue('requestedValue', normalizedValue, {
        shouldValidate: true,
        shouldDirty: false
      })
    }

    setValue('requestedValueFormatted', requestedValueFormatted, {
      shouldDirty: false
    })
    setCommittedRequestedValue(normalizedValue)
  }, [availableCredit, hasDirtyValues, requestedValue, setValue, mergeFields])

  return (
    <div className={styles.container}>
      <PreApprovedCreditCard availableCredit={availableCredit} />

      <RequestedValueInput
        availableCredit={availableCredit}
        isEditing={isEditingRequestedValue}
        setIsEditing={setIsEditingRequestedValue}
      />

      {shouldRecalculate && (
        <LoanRecalculationButton onRecalculate={handleRecalculate} />
      )}

      {!shouldRecalculate && !isErrorInstallments && (
        <>
          <PaymentMethod />

          <ProtectedFinancing withInsurance={withInsurance} />

          <Installments
            isLoadingInstallments={isLoadingInstallments}
            installments={installments}
            withInsurance={withInsurance}
            isRecalculating={isRecalculating}
            shouldRecalculate={shouldRecalculate}
          />
        </>
      )}
    </div>
  )
}
