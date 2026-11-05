'use client'

import { Typography } from '@porto-stack/ui'
import { useEffect, useState } from 'react'
import { Controller, useController, useFormContext } from 'react-hook-form'

import { buildGtmAttrs, maskLicensePlate, sanitize } from '@/utils'

import { useNavigationLock } from '@/hooks/useNavigationLock'
import { useServiceErrorEffect } from '@/hooks/useServiceErrorEffect'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm/context'
import { Input } from '@/components/UI/Input'

import s from './FCDCLicensePlateElement.module.scss'
import type { FCDCLicensePlateElementProps } from './FCDCLicensePlateElement.types'
import { useVehicleEligibilityFormSync } from './hooks/useVehicleEligibilityFormSync'
import { useVehicleEligibility } from './hooks/useVehicleEligibilty'

export const FCDCLicensePlateElement = ({
  element
}: FCDCLicensePlateElementProps) => {
  const { control, watch, setValue, clearErrors } = useFormContext()
  const { stepTitle } = useJourneyStepForm()
  const [vehiclePlate, setVehiclePlate] = useState('')
  const config = element.config

  const VEHICLE_PLATE_LENGTH = 7

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

  useEffect(() => {
    if (!isVehicleEligibilityError) return
    setVehiclePlate('')
    setValue(config.name, '', { shouldValidate: false })
  }, [isVehicleEligibilityError, setValue, config.name])

  useEffect(() => {
    const { unsubscribe } = watch((values, { name }) => {
      const watchedVehiclePlate = String(values[config.name] ?? '')

      if (
        name === config.name &&
        watchedVehiclePlate.length === VEHICLE_PLATE_LENGTH
      ) {
        setVehiclePlate(watchedVehiclePlate)
      }
    })

    return () => unsubscribe()
  }, [watch, config.name])

  return (
    <>
      <Controller
        control={control}
        name="vehiclePlate"
        render={({ field, fieldState }) => (
          <Input
            {...field}
            {...buildGtmAttrs({
              kind: 'form-input',
              stepTitle,
              label: config.label
            })}
            value={maskLicensePlate(field.value ?? '')}
            maxLength={8}
            onChange={handleVehiclePlateChange}
            isLoading={isVehicleEligibilityLoading}
            disabled={isVehicleEligibilityLoading}
            isValid={isVehicleEligibilitySuccess && !fieldState.error}
            errorMessage={fieldState.error?.message}
            className={s.input}
            variant={config.variant}
            {...(config.variant === 'big' && { placeholder: config.label })}
            {...(config.variant !== 'big' && { label: config.label })}
          />
        )}
      />
      {vehicleEligibilityData && (
        <div className={s.vehicleForm}>
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
          <Controller
            control={control}
            name="vehicleRenavam"
            render={({ field, fieldState }) => (
              <Input
                {...field}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: 'Renavam (opcional)'
                })}
                value={field.value}
                onChange={(e) =>
                  field.onChange(sanitize.digits(e.target.value).slice(0, 11))
                }
                maxLength={11}
                errorMessage={fieldState.error?.message ?? ''}
                variant="default"
                label="Renavam (opcional)"
              />
            )}
          />
        </div>
      )}
    </>
  )
}
