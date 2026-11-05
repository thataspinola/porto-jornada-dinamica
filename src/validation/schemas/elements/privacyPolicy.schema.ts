import { z } from 'zod'

import { baseElementSchema } from './baseElement.schema'

export const privacyPoliceElementSchema = baseElementSchema.extend({
  type: z.literal('PRIVACY_POLICY'),
  config: z.object({
    text: z
      .string()
      .default(
        '<p>Ao continuar, você está ciente de que a Porto irá coletar e tratar seus dados pessoais de acordo com a nossa <a target="_blank" href="https://www.portoseguro.com.br/privacidade" rel="noreferrer">Política de Privacidade</a></p>'
      )
  })
})
