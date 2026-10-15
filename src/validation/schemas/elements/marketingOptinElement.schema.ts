import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const marketingOptinElementSchema = baseElementSchema.extend({
  type: z.literal('MARKETING_OPTIN'),
  config: z.object({
    name: z.string().default('marketingOptIn'),
    label: z
      .string()
      .default(
        '<p>Tenho interesse em receber comunicação com condições especiais e ofertas de Produtos e Serviços Porto.</p>'
      ),
  }),
})
