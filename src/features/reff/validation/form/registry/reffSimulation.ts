import { z } from 'zod'

import type { ElementHandler } from '@/validation/form/registry/types'
import { requiredNumber } from '@/validation/primitives'

export const reffSimulation: ElementHandler<'REFF_SIMULATION'> = () => ({
  schema: {
    requestedValue: requiredNumber('Insira o valor solicitado.'),
    numberOfInstallments: z.coerce.number(
      'O número de parcelas deve ser um número'
    ),
    paymentMethod: z.enum(['CREDIT', 'INVOICE']),
    creditcardFlag: z.enum(['1000', '2000']).default('1000'),
    withInsurance: z.boolean()
  },
  defaultValues: {
    requestedValue: undefined,
    paymentMethod: 'INVOICE',
    numberOfInstallments: undefined,
    withInsurance: true,
    creditcardFlag: undefined
  }
})
