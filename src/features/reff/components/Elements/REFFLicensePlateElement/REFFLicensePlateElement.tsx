'use client'

import { Chips, Typography } from '@porto-stack/ui'
import { Fragment, useEffect, useState } from 'react'
import { Controller, useController, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, maskLicensePlate, sanitize } from '@/utils'

import { useNavigationLock } from '@/hooks/useNavigationLock'
import { useServiceErrorEffect } from '@/hooks/useServiceErrorEffect'

import { renderJourneyElement } from '@/components/Core/JourneyRenderElements/renderJourneyElement'
import { useJourneyStepForm } from '@/components/Core/JourneyStepForm'
import { Input } from '@/components/UI/Input'

import { useVehicleEligibilityFormSync } from './hooks/useVehicleEligibilityFormSync'
import { useVehicleEligibility } from './hooks/useVehicleEligibilty'
import s from './REFFLicensePlateElement.module.scss'
import type { REFFLicensePlateElementProps } from './REFFLicensePlateElement.types'

const VEHICLE_PLATE_LENGTH = 7

export const REFFLicensePlateElement = ({
  element
}: REFFLicensePlateElementProps) => {
  const {
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    getFieldState
  } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const [vehiclePlate, setVehiclePlate] = useState(
    getValues('vehiclePlate') ?? ''
  )
  const config = element.config

  const {
    vehicleEligibilityData,
    isVehicleEligibilityLoading,
    isVehicleEligibilitySuccess,
    isVehicleEligibilityError,
    vehicleEligibilityError
  } = useVehicleEligibility({
    plate: vehiclePlate
  })

  useNavigationLock({
    isLocked: isVehicleEligibilityLoading
  })

  useVehicleEligibilityFormSync({
    vehicleData: vehicleEligibilityData,
    setValue
  })

  useServiceErrorEffect(vehicleEligibilityError)

  const { field, fieldState } = useController({ name: 'vehiclePlate', control })
  const { field: eligibilityField } = useController({
    name: 'isVehicleEligible',
    control
  })

  function handleVehiclePlateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (fieldState.error) {
      clearErrors('vehiclePlate')
    }

    const nextValue = sanitize
      .alphanumeric(e.target.value)
      .toUpperCase()
      .slice(0, 7)

    if (nextValue !== vehiclePlate) {
      setVehiclePlate('')
    }

    field.onChange(nextValue)
  }

  function handleVehicleEligibilityChange(value: string) {
    if (value === 'yes') {
      return eligibilityField.onChange(true)
    }

    if (value === 'no') {
      return eligibilityField.onChange(false)
    }

    eligibilityField.onChange(null)
  }

  useEffect(() => {
    if (!isVehicleEligibilityError) return
    setValue(config.name, '', { shouldValidate: false })

    if (!getFieldState(config.name).error) {
      setError(config.name, { type: 'server', message: '' })
    }
  }, [
    isVehicleEligibilityError,
    setValue,
    setError,
    getFieldState,
    config.name
  ])

  useEffect(() => {
    const { unsubscribe } = watch((values, { name }) => {
      const watchedVehiclePlate = String(values[config.name] ?? '')

      if (
        (name === config.name || name === undefined) &&
        watchedVehiclePlate.length === VEHICLE_PLATE_LENGTH
      ) {
        setVehiclePlate(watchedVehiclePlate)
      }
    })

    return () => unsubscribe()
  }, [watch, config.name])

  const showSuccessContent =
    vehicleEligibilityData &&
    isVehicleEligibilitySuccess &&
    !isVehicleEligibilityLoading

  const showErrorContent =
    isVehicleEligibilityError && !isVehicleEligibilityLoading

  const showChildren =
    !showSuccessContent &&
    !showErrorContent &&
    element.config.children?.length > 0

  const gtmAttrs = buildGtmAttrs({
    kind: 'form-input',
    stepTitle,
    label: config.label
  })

  return (
    <div className={s.container} style={config.cssProperties}>
      <Controller
        control={control}
        name="vehiclePlate"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            {...gtmAttrs}
            value={maskLicensePlate(field.value ?? '')}
            maxLength={8}
            onChange={handleVehiclePlateChange}
            isLoading={isVehicleEligibilityLoading}
            disabled={isVehicleEligibilityLoading}
            isValid={isVehicleEligibilitySuccess && !fieldState.error}
            errorMessage={fieldState.error?.message}
            variant={config.variant}
            {...(config.variant === 'big' && { placeholder: config.label })}
            {...(config.variant !== 'big' && { label: config.label })}
          />
        )}
      />

      {showChildren && (
        <div>
          {element.config.children.map((child) => (
            <Fragment key={child.id}>{renderJourneyElement(child)}</Fragment>
          ))}
        </div>
      )}

      {showSuccessContent && (
        <div className={s.successContent}>
          <div className={s.vehicleData}>
            <Typography as="h3" variant="title6" weight="medium">
              {vehicleEligibilityData.brandDescription}
            </Typography>

            <Typography
              as="p"
              variant="body2"
              weight="regular"
              color="neutral-700">
              {`${vehicleEligibilityData.modelDescription} - ${vehicleEligibilityData.manufacturingYear}/${vehicleEligibilityData.modelYear}`}
            </Typography>

            <Typography
              as="p"
              variant="body2"
              weight="regular"
              color="neutral-700">
              {`FIPE: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(vehicleEligibilityData.fipeValue))}`}
            </Typography>
          </div>

          <div className={s.chipsContainer}>
            <Typography
              as="p"
              variant="title6"
              color="neutral-800"
              weight="medium">
              O veículo está quitado e em seu nome?
            </Typography>

            <Controller
              name="isVehicleEligible"
              render={({ field, fieldState }) => (
                <div className={s.chipsField}>
                  <Chips.Group
                    type="single"
                    value={
                      field.value === true
                        ? 'yes'
                        : field.value === false
                          ? 'no'
                          : ''
                    }
                    onValueChange={handleVehicleEligibilityChange}>
                    <Chips.Item value="yes">Sim</Chips.Item>
                    <Chips.Item value="no">Não</Chips.Item>
                  </Chips.Group>

                  {!!fieldState.error?.message && (
                    <Typography variant="caption" color="danger-500">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  )
}
