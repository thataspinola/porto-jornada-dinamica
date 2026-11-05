'use client'

import { Select } from '@porto-stack/ui'
import { useCallback } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { buildGtmAttrs, formatGtmText, pushEvent } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm'

import { FIELD_NAMES } from '../../constants'
import { useManufacturingYears } from '../../hooks/useManufacturingYears'
import { useVehicleBrands } from '../../hooks/useVehicleBrands'
import { useVehicleBrandsErrorHandler } from '../../hooks/useVehicleBrandsErrorHandler'
import { useVehicleModelsPrice } from '../../hooks/useVehicleModelsPrice'
import { useVehicleModelsPriceErrorHandler } from '../../hooks/useVehicleModelsPriceErrorHandler'
import { SelectedVehicleCard } from '../SelectedVehicleCard'
import { VehicleConditionChips } from '../VehicleConditionChips'
import s from './KnownVehicleForm.module.scss'

export function KnownVehicleForm() {
  const { control, setValue, resetField } = useFormContext()
  const { stepTitle } = useJourneyStepForm()

  const [isZeroKm, manufacturingYear, modelYear, brandCode, modelCode] =
    useWatch({
      control,
      name: [
        FIELD_NAMES.isZeroKm,
        FIELD_NAMES.vehicleManufacturingYear,
        FIELD_NAMES.vehicleModelYear,
        FIELD_NAMES.vehicleBrandCode,
        FIELD_NAMES.vehicleModelCode
      ]
    })

  const { manufacturingYearsArray, modelYearsArray } = useManufacturingYears({
    isZeroKm,
    manufacturingYear
  })

  const { vehicleBrandsData, isVehicleBrandsLoading, isVehicleBrandsError } =
    useVehicleBrands()

  useVehicleBrandsErrorHandler({ isVehicleBrandsError })

  const selectedBrand = vehicleBrandsData?.brands.find(
    (item) => item.code === String(brandCode)
  )

  const {
    vehicleModelsPriceData,
    isVehicleModelsPriceLoading,
    isVehicleModelsPriceError,
    isVehicleModelsPriceSuccess
  } = useVehicleModelsPrice({
    brandCode: Number(brandCode),
    modelYear,
    isZeroKm
  })

  const isVehicleModelsPriceEmpty =
    isVehicleModelsPriceSuccess && vehicleModelsPriceData?.models.length === 0

  const resetOnEmpty = useCallback(() => {
    resetField(FIELD_NAMES.vehicleBrandCode)
    resetField(FIELD_NAMES.vehicleModelCode)
    setValue(FIELD_NAMES.vehicleValue, undefined)
    setValue(FIELD_NAMES.vehicleModelFipeCode, '')
  }, [resetField, setValue])

  useVehicleModelsPriceErrorHandler({
    isVehicleModelsPriceError,
    isVehicleModelsPriceEmpty,
    resetOnEmpty
  })

  const selectedModel = vehicleModelsPriceData?.models.find(
    (item) => item.code === modelCode
  )

  const handleModelChange = (code: string) => {
    const model = vehicleModelsPriceData?.models.find(
      (item) => item.code === code
    )
    const modelReais = model?.value ? Number(model.value) : undefined
    setValue(
      FIELD_NAMES.vehicleValue,
      modelReais && !Number.isNaN(modelReais) ? modelReais : undefined,
      {
        shouldDirty: false,
        shouldValidate: false,
        shouldTouch: false
      }
    )
    setValue(FIELD_NAMES.vehicleModelFipeCode, model?.fipeCode ?? '', {
      shouldDirty: false,
      shouldValidate: false,
      shouldTouch: false
    })
  }

  const isShowFields = isZeroKm !== undefined

  const trackSelectChange = (label: string, description: string) => {
    pushEvent({
      event: 'select_content',
      evLabel: `${formatGtmText(label)}:${description}`,
      evAction: `selecionou:${formatGtmText(stepTitle)}`
    })
  }

  return (
    <div className={s.container}>
      <VehicleConditionChips />

      {isShowFields && (
        <div className={s.fieldsContainer}>
          <Controller
            control={control}
            name={FIELD_NAMES.vehicleManufacturingYear}
            render={({ field, fieldState }) => (
              <Select.Root
                label="Ano de fabricação"
                value={field.value ?? ''}
                onValueChange={(value) => {
                  field.onChange(value)
                  trackSelectChange('ano-de-fabricacao', value)
                }}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: 'ano-de-fabricacao'
                })}
                isValid={!!field.value && !fieldState.error?.message}
                errorMessage={fieldState.error?.message}
                disabled={field.disabled}
              >
                {manufacturingYearsArray.map((year) => (
                  <Select.Item key={year} value={String(year)}>
                    {year}
                  </Select.Item>
                ))}
              </Select.Root>
            )}
          />

          <Controller
            control={control}
            name={FIELD_NAMES.vehicleModelYear}
            disabled={!manufacturingYear}
            render={({ field, fieldState }) => (
              <Select.Root
                label="Ano do modelo"
                value={field.value ?? ''}
                onValueChange={(value) => {
                  resetField(FIELD_NAMES.vehicleModelCode)
                  field.onChange(value)
                  trackSelectChange('ano-do-modelo', value)
                }}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: 'ano-do-modelo'
                })}
                isValid={!!field.value && !fieldState.error?.message}
                disabled={field.disabled}
                errorMessage={fieldState.error?.message}
              >
                {modelYearsArray.map((year) => (
                  <Select.Item key={year} value={String(year)}>
                    {year}
                  </Select.Item>
                ))}
              </Select.Root>
            )}
          />

          <Controller
            control={control}
            name={FIELD_NAMES.vehicleBrandCode}
            disabled={!modelYear || isVehicleBrandsLoading}
            render={({ field, fieldState }) => (
              <Select.Root
                label="Marca"
                value={field.value ?? ''}
                onValueChange={(value) => {
                  resetField(FIELD_NAMES.vehicleModelCode)
                  field.onChange(value)
                  const description = vehicleBrandsData?.brands.find(
                    (item) => item.code === value
                  )?.description
                  trackSelectChange('marca', description ?? value)
                }}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: 'marca'
                })}
                isValid={!!field.value && !fieldState.error?.message}
                isLoading={isVehicleBrandsLoading}
                disabled={field.disabled}
                errorMessage={fieldState.error?.message}
              >
                {vehicleBrandsData?.brands?.map((item) => (
                  <Select.Item value={item.code} key={item.code}>
                    {item.description}
                  </Select.Item>
                ))}
              </Select.Root>
            )}
          />

          <Controller
            control={control}
            name={FIELD_NAMES.vehicleModelCode}
            disabled={!brandCode || isVehicleModelsPriceLoading}
            render={({ field, fieldState }) => (
              <Select.Root
                label="Modelo"
                value={field.value ?? ''}
                onValueChange={(value) => {
                  field.onChange(value)
                  handleModelChange(value)
                  const description = vehicleModelsPriceData?.models.find(
                    (item) => item.code === value
                  )?.description
                  trackSelectChange('modelo', description ?? value)
                }}
                {...buildGtmAttrs({
                  kind: 'form-input',
                  stepTitle,
                  label: 'modelo'
                })}
                isValid={!!field.value && !fieldState.error?.message}
                isLoading={isVehicleModelsPriceLoading}
                disabled={field.disabled}
                errorMessage={fieldState.error?.message}
              >
                {vehicleModelsPriceData?.models?.map((item) => (
                  <Select.Item value={item.code} key={item.code}>
                    {item.description}
                  </Select.Item>
                ))}
              </Select.Root>
            )}
          />

          {selectedModel && (
            <SelectedVehicleCard
              brandDescription={selectedBrand?.description}
              modelDescription={selectedModel.description}
              manufacturingYear={String(manufacturingYear ?? '')}
              modelYear={String(modelYear ?? '')}
              fipeValue={selectedModel.value}
            />
          )}
        </div>
      )}
    </div>
  )
}
