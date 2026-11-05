'use client'

import { Chips, Typography } from '@porto-stack/ui'
import { Controller, useFormContext } from 'react-hook-form'

import { buildGtmAttrs } from '@/utils'

import { useJourneyStepForm } from '@/components/Core/JourneyStepForm'

import { SCOPE_FIELD, VEHICLE_SCOPE } from '@/constants'

import { FIELD_NAMES } from '../../constants'
import s from './VehicleConditionChips.module.scss'

export function VehicleConditionChips() {
  const { control, reset } = useFormContext()
  const { stepTitle } = useJourneyStepForm()

  return (
    <div className={s.container}>
      <Typography as="h2" variant="title6">
        Qual a condição do veículo?
      </Typography>

      <Controller
        control={control}
        name={FIELD_NAMES.isZeroKm}
        render={({ field }) => {
          const fieldValue =
            field.value === true ? '0km' : field.value === false ? 'usado' : ''

          return (
            <Chips.Group
              type="single"
              value={fieldValue}
              onValueChange={(value) => {
                reset({
                  knowsVehicleModel: true,
                  isZeroKm: value === '0km',
                  [SCOPE_FIELD]: VEHICLE_SCOPE.knownBrandModel
                })
              }}
              className={s.chipsGroup}>
              <Chips.Item
                value={'0km'}
                {...buildGtmAttrs({
                  kind: 'button',
                  label: '0km',
                  stepTitle: stepTitle
                })}>
                0 Km
              </Chips.Item>
              <Chips.Item
                value="usado"
                {...buildGtmAttrs({
                  kind: 'button',
                  label: 'usado',
                  stepTitle: stepTitle
                })}>
                Usado
              </Chips.Item>
            </Chips.Group>
          )
        }}
      />
    </div>
  )
}
