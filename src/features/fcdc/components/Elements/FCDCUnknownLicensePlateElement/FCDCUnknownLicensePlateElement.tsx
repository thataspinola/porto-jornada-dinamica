'use client'

import { useFormContext, useWatch } from 'react-hook-form'

import { useNavigationVisibility } from '@/hooks/useNavigationVisibility'

import { KnownVehicleForm } from './components/KnownVehicleForm'
import { SelectionModeChips } from './components/SelectionModeChips'
import { UnknownVehicleForm } from './components/UnknownVehicleForm'
import { FIELD_NAMES } from './constants'
import s from './FCDCUnknownLicensePlateElement.module.scss'
import type { FCDCUnknownLicensePlateElementProps } from './FCDCUnknownLicensePlateElement.types'

export const FCDCUnknownLicensePlateElement = ({
  element: _element
}: FCDCUnknownLicensePlateElementProps) => {
  const { control } = useFormContext()

  const [knowsVehicleModel, isZeroKm] = useWatch({
    control,
    name: [FIELD_NAMES.knowsVehicleModel, FIELD_NAMES.isZeroKm]
  })

  const isModeKnown = knowsVehicleModel === true
  const isModeUnknown = knowsVehicleModel === false

  useNavigationVisibility({
    isHidden:
      knowsVehicleModel === undefined || (isModeKnown && isZeroKm === undefined)
  })

  return (
    <div className={s.container}>
      <SelectionModeChips />

      {isModeKnown && <KnownVehicleForm />}

      {isModeUnknown && <UnknownVehicleForm />}
    </div>
  )
}
