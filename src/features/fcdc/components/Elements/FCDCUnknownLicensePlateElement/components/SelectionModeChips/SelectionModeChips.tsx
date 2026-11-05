'use client'

import { Chips, Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStore } from '@/store/journeyStore'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm'

import { SCOPE_FIELD, VEHICLE_SCOPE } from '@/constants'

import { FIELD_NAMES } from '../../constants'
import s from './SelectionModeChips.module.scss'

export function SelectionModeChips() {
  const { control, reset } = useFormContext()
  const { parameters } = useJourneyStore()
  const { stepTitle } = useJourneyStepForm()

  return (
    <div className={s.container}>
      <Typography as="p" variant="title6">
        Já sabe qual modelo quer financiar?
      </Typography>

      <Controller
        control={control}
        name={FIELD_NAMES.knowsVehicleModel}
        render={({ field }) => {
          const fieldValue =
            field.value === true
              ? 'known'
              : field.value === false
                ? 'unknown'
                : ''

          return (
            <Chips.Group
              type="single"
              value={fieldValue}
              onValueChange={(value) => {
                const knows = value === 'known'

                if (knows) {
                  reset({
                    knowsVehicleModel: true,
                    [SCOPE_FIELD]: VEHICLE_SCOPE.knownBrandModel
                  })
                  return
                }

                const { manufacturingYear, modelYear, brand, model } =
                  parameters?.standardVehicle || {}

                reset({
                  knowsVehicleModel: false,
                  [SCOPE_FIELD]: VEHICLE_SCOPE.vehicleUnknown,
                  vehicleManufacturingYear: String(manufacturingYear ?? ''),
                  vehicleModelYear: String(modelYear ?? '').replace(/\D/g, ''),
                  vehicleBrandCode: brand ?? '',
                  vehicleModelCode: model ?? '',
                  vehicleModelFipeCode: ''
                })
              }}
              className={s.chipsGroup}>
              <Chips.Item
                value="known"
                {...buildGtmAttrs({
                  kind: 'button',
                  label: 'ja-sei',
                  stepTitle: stepTitle
                })}>
                Já sei
              </Chips.Item>
              <Chips.Item
                value="unknown"
                {...buildGtmAttrs({
                  kind: 'button',
                  label: 'ainda-nao',
                  stepTitle: stepTitle
                })}>
                Ainda não
              </Chips.Item>
            </Chips.Group>
          )
        }}
      />
    </div>
  )
}
