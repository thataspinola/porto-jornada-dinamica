import { SCOPE_FIELD } from '@/constants'
import type { ElementHandler } from '@/validation/form/registry/types'
import {
  optionalBoolean,
  optionalNumber,
  optionalString
} from '@/validation/primitives'

export const unknownPlate: ElementHandler<'FCDC_UNKNOWN_PLATE'> = () => ({
  schema: {
    knowsVehicleModel: optionalBoolean(),
    isZeroKm: optionalBoolean(),
    vehicleManufacturingYear: optionalString(),
    vehicleModelYear: optionalString(),
    vehicleBrandCode: optionalString(),
    vehicleModelCode: optionalString(),
    vehicleModelFipeCode: optionalString(),
    vehicleValue: optionalNumber(),
    [SCOPE_FIELD]: optionalString()
  },
  defaultValues: {
    knowsVehicleModel: undefined,
    isZeroKm: undefined,
    vehicleManufacturingYear: '',
    vehicleModelYear: '',
    vehicleBrandCode: '',
    vehicleModelCode: '',
    vehicleModelFipeCode: '',
    vehicleValue: undefined,
    [SCOPE_FIELD]: undefined
  },
  refine: (data, ctx) => {
    if (data.knowsVehicleModel === false) {
      if (typeof data.vehicleValue !== 'number' || data.vehicleValue <= 0) {
        ctx.addIssue({
          path: ['vehicleValue'],
          code: 'custom',
          message: 'Insira o valor do veículo.'
        })
      }

      return
    }

    if (data.knowsVehicleModel === true && data.isZeroKm !== undefined) {
      if (!data.vehicleManufacturingYear) {
        ctx.addIssue({
          path: ['vehicleManufacturingYear'],
          code: 'custom',
          message: 'Selecione o ano de fabricação.'
        })

        return
      }

      if (!data.vehicleModelYear) {
        ctx.addIssue({
          path: ['vehicleModelYear'],
          code: 'custom',
          message: 'Selecione o ano do modelo.'
        })

        return
      }

      if (!data.vehicleBrandCode) {
        ctx.addIssue({
          path: ['vehicleBrandCode'],
          code: 'custom',
          message: 'Selecione a marca do veículo.'
        })

        return
      }

      if (!data.vehicleModelCode) {
        ctx.addIssue({
          path: ['vehicleModelCode'],
          code: 'custom',
          message: 'Selecione o modelo do veículo.'
        })

        return
      }
    }
  }
})
