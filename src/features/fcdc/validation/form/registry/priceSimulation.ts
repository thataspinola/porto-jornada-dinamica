import { z } from 'zod'

import type { ElementHandler } from '@/validation/form/registry/types'
import { requiredNumber } from '@/validation/primitives'

export const priceSimulation: ElementHandler<'FCDC_PRICE_SIMULATION'> = () => ({
  schema: {
    vehicleValue: requiredNumber('Insira o valor do veículo.'),
    vehicleEntryValue: requiredNumber('Insira o valor da entrada.'),
    numberOfInstallments: z.coerce.number(
      'O número de parcelas deve ser um número'
    ),
    paymentMethod: z.enum(['CREDIT', 'INVOICE']),
    creditcardFlag: z.enum(['1000', '2000']).default('1000'),
    withInsurance: z.boolean()
  },
  defaultValues: {
    vehicleValue: undefined,
    vehicleEntryValue: undefined,
    paymentMethod: 'INVOICE',
    numberOfInstallments: undefined,
    withInsurance: true,
    creditcardFlag: undefined
  },
  refine: (data, ctx) => {
    const vehicleValue = data.vehicleValue
    const entryValue = data.vehicleEntryValue

    if (
      typeof vehicleValue === 'number' &&
      typeof entryValue === 'number' &&
      vehicleValue > 0 &&
      entryValue > vehicleValue
    ) {
      ctx.addIssue({
        path: ['vehicleEntryValue'],
        code: 'custom',
        message: 'O valor da entrada não pode ser maior que o valor do veículo'
      })
    }
  }
})
