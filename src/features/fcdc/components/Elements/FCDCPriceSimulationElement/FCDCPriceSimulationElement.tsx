'use client'

import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useShallow } from 'zustand/shallow'

import { useJourneyStore } from '@/store/journeyStore'
import { useNavigationStore } from '@/store/navigationStore'

import { SCOPE_FIELD } from '@/constants'
import type { JourneyDefinition } from '@/validation/schemas'

import { Installments } from './components/Installments'
import { LoanRecalculationButton } from './components/LoanRecalculationButton'
import { PaymentMethod } from './components/PaymentMethod'
import { PreApprovedCreditCard } from './components/PreApprovedCreditCard'
import { ProtectedFinancing } from './components/ProtectedFinancing'
import { VehicleFinancingInputs } from './components/VehicleFinancingInputs'
import styles from './FCDCPriceSimulationElement.module.scss'
import { useEntryCalculation } from './useEntryCalculation'
import { useFCDCPriceSimulationErrorHandler } from './useFCDCPriceSimulationErrorHandler'
import { useInstallments } from './useInstallments'

type FCDCPriceSimulationElementType = Extract<
  JourneyDefinition['steps'][number]['elements'][number],
  { type: 'FCDC_PRICE_SIMULATION' }
>

export type FCDCPriceSimulationElementProps = {
  element: FCDCPriceSimulationElementType
}

const toReais = (value: unknown): number => {
  return typeof value === 'number' && value > 0 ? value : 0
}

export const FCDCPriceSimulationElement = ({
  element: _element
}: FCDCPriceSimulationElementProps) => {
  const [isRecalculating, setIsRecalculating] = useState(false)
  const [isEditingVehicleValue, setIsEditingVehicleValue] = useState(false)
  const [isEditingEntryValue, setIsEditingEntryValue] = useState(false)

  const fields = useJourneyStore((state) => state.fields)

  const { hideNavigation, showNavigation } = useNavigationStore(
    useShallow((store) => ({
      hideNavigation: store.hideNavigation,
      showNavigation: store.showNavigation
    }))
  )
  const { setValue, getValues, watch, trigger, reset, formState } =
    useFormContext()

  const vehicleValueInReais = toReais(
    getValues('vehicleValue') ?? fields.vehicleValue
  )
  const entryValueInReais = toReais(
    getValues('vehicleEntryValue') ?? fields.vehicleEntryValue
  )

  const paymentMethod = watch('paymentMethod') as 'CREDIT' | 'INVOICE'
  const withInsurance = watch('withInsurance') as boolean

  const [committedValues, setCommittedValues] = useState({
    vehicleValue: vehicleValueInReais,
    entryValue: entryValueInReais
  })

  const [recalcNonce, setRecalcNonce] = useState(0)

  const {
    entryCalculation,
    isLoadingEntryCalculation,
    isErrorEntryCalculation,
    errorEntryCalculation
  } = useEntryCalculation({
    vehicleValue: committedValues.vehicleValue,
    entryValue: committedValues.entryValue,
    nonce: recalcNonce
  })

  const {
    installments,
    isLoadingInstallments,
    isErrorInstallments,
    errorInstallments
  } = useInstallments({
    entryValue: entryCalculation?.resultingEntry,
    paymentMethod,
    vehicleValue: committedValues.vehicleValue,
    scope: fields[SCOPE_FIELD],
    nonce: recalcNonce
  })

  useFCDCPriceSimulationErrorHandler({
    errorEntryCalculation,
    errorInstallments
  })

  const handleRecalculate = useCallback(async () => {
    const isValid = await trigger(['vehicleValue', 'vehicleEntryValue'])

    if (!isValid) return

    setIsRecalculating(true)

    try {
      const values = getValues()

      setCommittedValues({
        vehicleValue: toReais(values.vehicleValue),
        entryValue: toReais(values.vehicleEntryValue)
      })
      setRecalcNonce((n) => n + 1)

      reset(values, { keepValues: true })
    } finally {
      setIsRecalculating(false)
    }
  }, [trigger, getValues, reset])

  const isSimulating = isLoadingEntryCalculation || isRecalculating
  const hasError = isErrorEntryCalculation || isErrorInstallments
  const hasDirtyValues =
    !!formState.dirtyFields?.vehicleEntryValue ||
    !!formState.dirtyFields?.vehicleValue
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
    if (!entryCalculation?.resultingEntry) {
      return
    }

    setValue('vehicleEntryValue', entryCalculation.resultingEntry, {
      shouldValidate: true,
      shouldDirty: false
    })
  }, [entryCalculation, setValue])

  useEffect(() => {
    if (isErrorEntryCalculation) {
      setValue('vehicleEntryValue', undefined)
    }
  }, [isErrorEntryCalculation, setValue])

  return (
    <div className={styles.container}>
      <PreApprovedCreditCard />

      <VehicleFinancingInputs
        isEditingVehicleValue={isEditingVehicleValue}
        setIsEditingVehicleValue={setIsEditingVehicleValue}
        isEditingEntryValue={isEditingEntryValue}
        setIsEditingEntryValue={setIsEditingEntryValue}
        isLoadingEntryCalculation={isLoadingEntryCalculation}
      />

      {shouldRecalculate && (
        <LoanRecalculationButton onRecalculate={handleRecalculate} />
      )}

      {!shouldRecalculate &&
        !isErrorEntryCalculation &&
        !isErrorInstallments && (
          <>
            <Installments
              isLoadingEntryCalculation={isLoadingEntryCalculation}
              isLoadingInstallments={isLoadingInstallments}
              installments={installments}
              withInsurance={withInsurance}
              isRecalculating={isRecalculating}
              shouldRecalculate={shouldRecalculate}
            />

            <PaymentMethod />

            <ProtectedFinancing withInsurance={withInsurance} />
          </>
        )}
    </div>
  )
}
