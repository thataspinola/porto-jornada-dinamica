import { useEffect } from 'react'
import type { FieldValues, UseFormSetValue } from 'react-hook-form'

import type { useVehicleEligibility } from './useVehicleEligibilty'

type UseVehicleEligibilityFormSyncParams = {
  vehicleData?: ReturnType<
    typeof useVehicleEligibility
  >['vehicleEligibilityData']
  setValue: UseFormSetValue<FieldValues>
}

export function useVehicleEligibilityFormSync({
  vehicleData,
  setValue
}: UseVehicleEligibilityFormSyncParams) {
  useEffect(() => {
    if (!vehicleData) return

    setValue('vehicleBrand', vehicleData.brandDescription)
    setValue('vehicleModel', vehicleData.modelDescription)
    setValue('vehicleModelYear', vehicleData.modelYear)
    setValue('vehicleManufacturingYear', vehicleData.manufacturingYear)
    setValue('vehicleFipeCode', vehicleData.fipeCode)
    setValue('vehicleValue', vehicleData.fipeValue)
  }, [vehicleData, setValue])
}
