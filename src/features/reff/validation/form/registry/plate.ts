import z from 'zod'

import type { ElementHandler } from '@/validation/form/registry/types'
import {
  optionalString,
  requiredNumber,
  requiredString
} from '@/validation/primitives'

export const plate: ElementHandler<'REFF_PLATE_INPUT'> = ({
  name
}: {
  name: string
}) => ({
  schema: {
    [name]: z
      .string()
      .nonempty('Insira a placa do veículo.')
      .length(7, 'Insira uma placa válida.'),
    vehicleBrand: requiredString('Insira a marca do veículo.'),
    vehicleModel: requiredString('Insira o modelo do veículo.'),
    vehicleModelYear: requiredString('Insira o ano do modelo do veículo.'),
    vehicleManufacturingYear: requiredString(
      'Insira o ano de fabricação do veículo.'
    ),
    vehicleFipeCode: requiredString('Insira o código FIPE do veículo.'),
    vehicleValue: requiredNumber('Insira o valor do veículo.'),
    vehicleChassis: optionalString(),
    vehicleRenavam: optionalString(),
    isVehicleEligible: z.boolean(
      'É necessário informar se o veículo está quitado e em seu nome.'
    )
  },
  defaultValues: {
    [name]: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleModelYear: '',
    vehicleManufacturingYear: '',
    vehicleFipeCode: '',
    vehicleValue: undefined,
    vehicleChassis: '',
    vehicleRenavam: '',
    isVehicleEligible: undefined
  }
})
